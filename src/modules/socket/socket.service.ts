import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { CacheService } from '../../providers/cache/cache.service';
import { UserDocument } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private readonly jwtSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private cacheService: CacheService,
  ) {
    this.jwtSecret = this.configService.get('security.jwtSecret');
  }

  private readonly sockets: Map<string, Socket> = new Map();

  async handleConnection(socket: Socket): Promise<void> {
    try {
      let token: string = socket.handshake.query.token as string;
      // Verify token
      const data = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      if (!data) {
        this.logger.log(`Can not verify token!`);
        throw new UnauthorizedException();
      }

      const user: UserDocument =
        this.cacheService.getUser(data.address) ||
        (await this.userService.findByAddress(data.address));

      if (!user) {
        this.logger.log(`No user found!`);
        throw new BadRequestException();
      }

      this.logger.log(`Address ${user.address} connected!`);

      // Save to cache
      user.socketId = socket.id;
      socket['address'] = user.address;
      this.sockets.set(socket.id, socket);
    } catch (err) {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket): void {
    this.sockets.delete(socket.id);
  }

  getSocket(socketId: string): Socket {
    return this.sockets.get(socketId);
  }
}
