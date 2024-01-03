import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SocketModule } from '../../providers/socket/socket.module';
import { HorseRaceGateway } from './horserace.gateway';
import { HorseRaceService } from './horserace.service';
import { CacheModule } from '../../providers/cache/cache.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [UserModule, HistoryModule, SocketModule, CacheModule],
  providers: [HorseRaceGateway, HorseRaceService],
  exports: [HorseRaceService],
})
export class HorseRaceModule {}
