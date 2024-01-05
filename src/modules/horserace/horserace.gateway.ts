import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketService } from '../../providers/socket/socket.service';
import { HORSE_RACE_EVENT } from './horserace.constant';
import { HorseRaceService } from './horserace.service';
import { CreateRoomDto, JoinRoomDto } from './horserace.dto';
import { SocketUser } from 'src/providers/socket/socket.interface';
import { HorseraceGuard } from './horserace.guard';

@WebSocketGateway({ namespace: 'horse-race' })
@UseGuards(HorseraceGuard)
export class HorseRaceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Socket;
  private readonly logger = new Logger(HorseRaceGateway.name);
  constructor(
    private readonly socketService: SocketService,
    private horseRaceService: HorseRaceService,
  ) {}

  handleConnection(@ConnectedSocket() socket: SocketUser): void {
    try {
      this.socketService.handleConnection(socket);
    } catch (err) {
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: SocketUser): void {
    try {
      const { updatedUsers, roomId } = this.horseRaceService.leaveRoom(
        socket.address,
      );
      if (updatedUsers) {
        this.logger.log(`User ${socket.address} leave room ${roomId}!`);
        socket.leave(roomId);
        socket.to(roomId).emit(HORSE_RACE_EVENT.LEAVE_ROOM, updatedUsers);
        this.socketService.handleDisconnect(socket);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage(HORSE_RACE_EVENT.ROOMS)
  handleGetRooms(@ConnectedSocket() socket: SocketUser): void {
    try {
      socket.emit(HORSE_RACE_EVENT.ROOMS, this.horseRaceService.listRooms);
    } catch (err) {
      this.logger.error(err);
    }
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
        this.logger.log(
          `User ${socket.address} create new room ${newRoom.id}!`,
        );
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
        this.logger.log(
          `New user ${socket.address} join room ${newUser.roomId}!`,
        );
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
        this.logger.log(`User ${socket.address} leave room ${roomId}!`);
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
      const roomId = updatedUser.roomId;
      if (updatedUser) {
        const roomIsReady = this.horseRaceService.checkRoomIsReady(roomId);
        if (roomIsReady) {
          const winner = this.horseRaceService.getRoomWinner(roomId);
          this.logger.log(`Winner is ${winner.address}!`);
          this.server
            .to(roomId)
            .emit(HORSE_RACE_EVENT.READY_OR_NOT, { winner, roomIsReady });
          this.server.in(roomId).socketsLeave(roomId);
          this.horseRaceService.updateUsersWhenFinished(roomId);
          this.horseRaceService.deleteRoom(roomId);
        } else {
          this.logger.log(
            `Update user ${updatedUser.address} status to ${updatedUser.isReady} in room ${roomId}`,
          );
          socket
            .to(roomId)
            .emit(HORSE_RACE_EVENT.READY_OR_NOT, { updatedUser, roomIsReady });
        }
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
