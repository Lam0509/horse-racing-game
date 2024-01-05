import { WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}
  async handleConnection(socket: Socket): Promise<void> {
    try {
      await this.socketService.handleConnection(socket);
    } catch (err) {
      socket.disconnect();
    }
  }
}
