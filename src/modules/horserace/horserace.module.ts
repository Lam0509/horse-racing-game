import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SocketModule } from '../../providers/socket/socket.module';
import { HorseRaceGateway } from './horserace.gateway';
import { HorseRaceService } from './horserace.service';
import { CacheModule } from '../../providers/cache/cache.module';
import { HistoryModule } from '../history/history.module';
import { HorseraceController } from './horserace.controller';
import { TokenModule } from 'src/providers/token/token.module';

@Module({
  imports: [UserModule, HistoryModule, SocketModule, CacheModule, TokenModule],
  providers: [HorseRaceGateway, HorseRaceService],
  exports: [HorseRaceService],
  controllers: [HorseraceController],
})
export class HorseRaceModule {}
