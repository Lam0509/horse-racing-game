import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from '../socket/socket.service';

@WebSocketGateway()

export class HorseRaceGateway {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) { }
  
  @SubscribeMessage('game')
  handleEventTest(socket: Socket, data: unknown): void {
    console.log(data)
  }

  // Implement other Socket.IO event handlers and message handlers
}