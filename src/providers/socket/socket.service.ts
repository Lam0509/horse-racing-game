import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserService } from '../../modules/user/user.service';
import { CacheService } from '../cache/cache.service';
import { UserDocument } from '../../modules/user/user.schema';
import { TokenService } from 'src/providers/token/token.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private cacheService: CacheService,
  ) {}

  private readonly sockets: Map<string, Socket> = new Map();

  async handleConnection(socket: Socket): Promise<void> {
    let token: string = socket.handshake.query.token as string;
    if (!token) {
      throw new WsException('No token found');
    }
    // Verify token
    const data = await this.tokenService.verifyJwt(token);

    if (!data) {
      throw new WsException('Can not verify token!');
    }

    const realToken = await this.cacheService.get(data.address);

    if (token !== realToken) {
      throw new WsException('Wrong token!');
    }

    let user: UserDocument = this.cacheService.getUser(data.address);

    if (!user) {
      user = await this.userService.findByAddress(data.address);
      if (!user) {
        throw new WsException('No user found!');
      }
      // Save to cache
      this.cacheService.addUser(user);
    }

    this.logger.log(`Address ${user.address} connected!`);

    socket['address'] = user.address;
    this.sockets.set(socket.id, socket);
  }

  handleDisconnect(socket: Socket): void {
    this.sockets.delete(socket.id);
  }

  getSocket(socketId: string): Socket {
    return this.sockets.get(socketId);
  }
}
