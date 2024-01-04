import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketService } from '../../providers/socket/socket.service';
import { HORSE_RACE_EVENT } from './horserace.constant';
import { HorseRaceService } from './horserace.service';
import { CacheService } from '../../providers/cache/cache.service';
import { CreateRoomDto, JoinRoomDto, SocketUser } from './horserace.dto';
import { HistoryService } from '../history/history.service';

@WebSocketGateway({ namespace: 'horse-race' })
export class HorseRaceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Socket;
  // readonly id: string = 'horse-race';
  private readonly logger = new Logger(HorseRaceGateway.name);
  constructor(
    private readonly socketService: SocketService,
    private cacheService: CacheService,
    private horseRaceService: HorseRaceService,
    private historyService: HistoryService,
  ) {}

  async handleConnection(socket: Socket): Promise<void> {
    try {
      await this.socketService.handleConnection(socket);
    } catch (err) {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket): void {
    this.socketService.handleDisconnect(socket);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.ROOMS)
  handleGetRooms(socket: Socket): void {
    socket.emit(HORSE_RACE_EVENT.ROOMS, this.horseRaceService.listRooms);
  }

  @SubscribeMessage(HORSE_RACE_EVENT.CREATE_ROOM)
  handleCreateRoom(
    @ConnectedSocket() socket: SocketUser,
    @MessageBody() data: CreateRoomDto,
  ): void {
    try {
      const { name, bet } = data;
      const newRoom = this.horseRaceService.createRoom(
        name,
        bet,
        socket.address,
      );
      if (newRoom) {
        socket.join(newRoom.id);
        socket.broadcast.emit(HORSE_RACE_EVENT.CREATE_ROOM, newRoom);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage(HORSE_RACE_EVENT.JOIN_ROOM)
  handleJoinRoom(
    @ConnectedSocket() socket: SocketUser,
    @MessageBody() data: JoinRoomDto,
  ): void {
    try {
      const { roomId } = data;
      const newUser = this.horseRaceService.joinRoom(roomId, socket.address);
      if (newUser) {
        socket.join(roomId);
        socket.to(roomId).emit(HORSE_RACE_EVENT.JOIN_ROOM, newUser);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage(HORSE_RACE_EVENT.LEAVE_ROOM)
  handleLeaveRoom(@ConnectedSocket() socket: SocketUser): void {
    try {
      const { updatedUsers, roomId } = this.horseRaceService.leaveRoom(
        socket.address,
      );
      if (updatedUsers) {
        socket.leave(roomId);
        socket.to(roomId).emit(HORSE_RACE_EVENT.LEAVE_ROOM, updatedUsers);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage(HORSE_RACE_EVENT.READY_OR_NOT)
  handleGetReadyOrNot(@ConnectedSocket() socket: SocketUser): void {
    try {
      const updatedUser = this.horseRaceService.changeUserStatusInRoom(
        socket.address,
      );
      if (updatedUser) {
        const roomId = updatedUser.roomId;
        const roomIsReady = this.horseRaceService.checkRoomIsReady(roomId);
        if (roomIsReady) {
          const winner = this.horseRaceService.getRoomWinner(roomId);
          this.horseRaceService.updateUsersWhenFinished(roomId);
          this.logger.log(`Winner is ${winner.address}!`);
          this.server
            .to(roomId)
            .emit(HORSE_RACE_EVENT.READY_OR_NOT, { winner, roomIsReady });
          this.server.in(roomId).socketsLeave(roomId);
          this.horseRaceService.deleteRoom(roomId);
        } else {
          socket
            .to(roomId)
            .emit(HORSE_RACE_EVENT.READY_OR_NOT, { updatedUser, roomIsReady });
        }
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  // @SubscribeMessage(HORSE_RACE_EVENT.SEARCH_ROOMS)
  // handleSearchRooms(socket: Socket, roomId: string): void {
  //   let rooms: HorseRaceRoomInfo[] = this.horseRaceService.searchRooms(roomId);
  //   socket.emit(HORSE_RACE_EVENT.SEARCH_ROOMS, rooms);
  // }

  // endGame(room: HorseRaceRoom): void {
  //   room.generateResult();
  //   room.updateReward();
  //   this.historyService.create(room.bets);
  //   // TO DO: gọi api cộng tiền
  //   this.server.to(room.id).emit(HORSE_RACE_EVENT.RESULT, room.result);

  //   room.winningBets.forEach((bet) => {
  //     // TO DO : event cộng tiền phải bắn số dư thay vì số tiền thắng
  //     const user: UserDocument = this.cacheService.getUser(bet.userAddress);
  //     this.server
  //       .to(user.socketId)
  //       .emit(HORSE_RACE_EVENT.GIVE_REWARD, bet.reward);
  //   });
  //   this.server.in(room.id).socketsLeave(room.id);
  //   this.horseRaceService.deleteRoom(room.id);
  //   this.sendListRooms();
  // }

  // sendListRooms(): void {
  //   this.server
  //     .except(this.horseRaceService.listRoomIds)
  //     .emit(HORSE_RACE_EVENT.ROOMS, this.horseRaceService.listRooms);
  // }
}
