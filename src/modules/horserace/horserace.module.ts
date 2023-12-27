import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SocketModule } from '../socket/socket.module';
import { HorseRaceGateway } from './horserace.gateway';
import { HorseRaceService } from './horserace.service';

@Module({
    imports: [
        UserModule,
        SocketModule
    ],
    providers: [
        HorseRaceGateway,
        HorseRaceService
    ],
})
export class HorseRaceModule { }