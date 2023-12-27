import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { TokenService } from '../../providers/token/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(TokenService.name);
  constructor(
    private tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  private readonly sockets: Map<string, Socket> = new Map();

  async handleConnection(socket: Socket): Promise<void> {
    try {
      let token: string = socket.handshake.headers.token as string;

      // Verify token
      const data = await this.tokenService.verifyJwt(token);

      if (!data) {
        this.logger.log(`Can not verify token!`);
        throw new UnauthorizedException();
      }

      const user = await this.userService.findByAddress(data.address);

      if (!user) {
        this.logger.log(`No user found!`);
        throw new BadRequestException();
      }

      this.logger.log(`Address ${user.address} connected!`);

      // Save to cache
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
