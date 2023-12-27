import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from './socket.auth.guard';
import { EVENT } from './event.name.constant';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage(EVENT.TEST)
  handleEventTest(socket: Socket, data: unknown): void {
    // handle event
    console.log(data);
  }
}
