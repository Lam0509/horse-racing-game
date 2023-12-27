import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from '../socket/socket.service';
import { HORSE_RACE_EVENT } from './horserace.event.constant';
import { HorseRaceService } from './horserace.service';

@WebSocketGateway()
export class HorseRaceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;

  constructor(
    private readonly socketService: SocketService,
    private horseRaceService: HorseRaceService,
  ) { }

  handleConnection(socket: Socket) {
    this.horseRaceService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket) {
    this.horseRaceService.handleDisconnect(socket);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.BET)
  handleBet(socket: Socket, data: unknown): void {
    console.log(socket.id, data)
  }

  // Implement other Socket.IO event handlers and message handlers
}