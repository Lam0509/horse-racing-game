import { HorseRaceService } from '../../modules/horserace/horserace.service';

export const InitRoomsProvider = {
  provide: 'INIT_ROOMS',
  inject: [HorseRaceService],
  useFactory: (horseRaceService: HorseRaceService) => {
    // horseRaceService.initRooms(10);
  },
};
