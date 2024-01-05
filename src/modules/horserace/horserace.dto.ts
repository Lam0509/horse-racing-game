import { IsInt, Min, IsNotEmpty, IsString } from 'class-validator';

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
