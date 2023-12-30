import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketService } from '../socket/socket.service';
import { HORSE_RACE_EVENT } from './horserace.constant';
import { HorseRaceService } from './horserace.service';
import { HorseRaceRoom } from './horserace.room';
import { CacheService } from '../../providers/cache/cache.service';
import { UserDocument } from '../user/user.schema';
import { HorseRaceBetDto } from './horse.race.dto';
import { HistoryService } from '../history/history.service';

@WebSocketGateway()
export class HorseRaceGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;
  readonly id: string = 'horse-race';

  constructor(
    private readonly socketService: SocketService,
    private cacheService: CacheService,
    private horseRaceService: HorseRaceService,
    private historyService: HistoryService,
  ) { }

  handleConnection(socket: Socket): void {
    this.horseRaceService.handleConnection(socket, this.id);
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
    const room: HorseRaceRoom = this.horseRaceService.getRoom(roomId);
    if (!room) return;
    const user: UserDocument = this.cacheService.getUser(socket['address']);
    if (!room.addUser(user)) return;
    socket.join(room.id);
    this.server
      .to(this.id)
      .emit(HORSE_RACE_EVENT.ROOMS, this.horseRaceService.rooms);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.LEAVE_ROOM)
  handleLeaveRoom(socket: Socket): void {
    let user: UserDocument = this.cacheService.getUser(socket['address']);
    let room: HorseRaceRoom = this.horseRaceService.getRoom(user.roomId);
    if (!room || !room.removeUser(user.address)) return;
    socket.leave(room.id);
    this.server
      .to(this.id)
      .emit(HORSE_RACE_EVENT.ROOMS, this.horseRaceService.rooms);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(HORSE_RACE_EVENT.BET)
  handleBet(socket: Socket, data: HorseRaceBetDto): void {
    // TO DO: gọi api trừ số dư ví
    let user: UserDocument = this.cacheService.getUser(socket['address']);
    let room: HorseRaceRoom = this.horseRaceService.getRoom(user.roomId);
    room.addBet(this.id, user.address, data.money, data.horse);

    if (!room.isReady) return;
    this.endGame(room);
  }

  endGame(room: HorseRaceRoom): void {
    room.generateResult();
    room.updateReward();
    this.historyService.create(room.bets);
    // TO DO: gọi api cộng tiền
    this.server
      .to(room.id)
      .emit(HORSE_RACE_EVENT.RESULT, room.result);

    room.winningBets.forEach(bet => {
      // TO DO : event cộng tiền phải bắn số dư thay vì số tiền thắng
      const user: UserDocument = this.cacheService.getUser(bet.userAddress);
      this.server
        .to(user.socketId)
        .emit(HORSE_RACE_EVENT.GIVE_REWARD, bet.reward);
    });
    this.horseRaceService.deleteRoom(room.id);
  }
}