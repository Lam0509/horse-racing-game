import { IsInt, Min, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Socket } from 'socket.io';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Bet amount must be greater than 0' })
  bet: number;
}

export class JoinRoomDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;
}

export type SocketUser = Socket & {
  address: string;
};

export enum RoomStatus {
  WAITING = 'waiting',
  STARTING = 'starting',
}
