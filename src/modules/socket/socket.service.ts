import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {

  constructor() {}

  private readonly connectedClients: Map<string, Socket> = new Map();

  async handleConnection(socket: Socket): Promise<void> {
    let token: string = socket.handshake.headers.token as string;
    // this.tokenService.verify(token);

    this.connectedClients.set(socket.id, socket);
    socket.on('disconnect', () => {
    });

  }

  getSocket(socketId: string): Socket {
    return this.connectedClients.get(socketId);
  }
}