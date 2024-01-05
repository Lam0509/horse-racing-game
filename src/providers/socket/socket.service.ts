import { Injectable, Logger } from '@nestjs/common';
import { SocketUser } from './socket.interface';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  constructor() {}

  private readonly sockets: Map<string, SocketUser> = new Map();

  async handleConnection(socket: SocketUser): Promise<void> {
    this.sockets.set(socket.id, socket);
  }

  handleDisconnect(socket: SocketUser): void {
    this.sockets.delete(socket.id);
  }

  getSocket(socketId: string): SocketUser {
    return this.sockets.get(socketId);
  }
}
