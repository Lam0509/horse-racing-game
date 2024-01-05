import { Controller, Get, Logger } from '@nestjs/common';
import { HorseRaceService } from './horserace.service';
import { HorseRaceRoom } from './horserace.room';

@Controller('horse-race-game')
export class HorseraceController {
  private readonly logger = new Logger(HorseraceController.name);
  constructor(private readonly horseraceService: HorseRaceService) {}

  @Get('/rooms')
  getGameRooms(): HorseRaceRoom[] {
    try {
      return this.horseraceService.listRooms;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
