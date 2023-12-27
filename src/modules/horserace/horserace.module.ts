import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { HorseRaceGateway } from './horserace.gateway';
import { SocketModule } from '../socket/socket.module';

@Module({
    imports: [
        UserModule,
        SocketModule
    ],
    providers: [
        HorseRaceGateway,
    ],
})
export class HorseRaceModule { }