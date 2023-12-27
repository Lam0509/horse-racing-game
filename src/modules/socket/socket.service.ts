import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { TokenService } from '../../providers/token/token.service';

@Injectable()
export class SocketService {

  constructor(private tokenService: TokenService) { }

  private readonly sockets: Map<string, Socket> = new Map();

  async handleConnection(socket: Socket): Promise<void> {

    try {
      let token: string = socket.handshake.headers.token as string;
      // this.tokenService.verifyJwt(token);
      this.sockets.set(socket.id, socket);
      // get user info & attach it to socket instance
      // socket['user'] = user
    }
    catch (err) {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.sockets.delete(socket.id);
  }

  getSocket(socketId: string): Socket {
    return this.sockets.get(socketId);
  }
}