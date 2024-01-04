import { IsInt, Min, IsIn } from 'class-validator';

import { HORSE } from './horserace.constant';

export class HorseRaceBetDto {
  @IsIn(Object.values(HORSE))
  horse: number;

  @IsInt()
  @Min(1, { message: 'Bet amout must be greater than 0' })
  money: number;
}
