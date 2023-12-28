import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from '../socket/socket.service';
import { HORSE_RACE_EVENT } from './horserace.event.constant';
import { HorseRaceService } from './horserace.service';
import { HorseRaceRoom } from './horserace.room';

@WebSocketGateway()
export class HorseRaceGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;

  constructor(
    private readonly socketService: SocketService,
    private horseRaceService: HorseRaceService,
  ) { }

  handleConnection(socket: Socket): void {
    this.horseRaceService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket): void {
    this.horseRaceService.handleDisconnect(socket);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.ROOMS)
  handleGetRooms(socket: Socket): void {
    socket.emit(HORSE_RACE_EVENT.ROOMS, this.horseRaceService.rooms);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.SEARCH_ROOMS)
  handleSearchRooms(socket: Socket, roomId: string): void {
    let rooms: HorseRaceRoom[] = this.horseRaceService.searchRooms(roomId);
    socket.emit(HORSE_RACE_EVENT.SEARCH_ROOMS, rooms);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.JOIN_ROOM)
  handleJoinRoom(socket: Socket, roomId: string): void {
    const room: HorseRaceRoom = this.horseRaceService.getRoomById(roomId);
    if (!room || !room.addUser(socket['user'])) return;
    socket.join(room.id);
    this.server
      .to(room.id)
      .emit(HORSE_RACE_EVENT.ROOM_USERS, room.users);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.BET)
  handleBet(socket: Socket, data: unknown): void {
    console.log(socket.id, data)
  }
}
