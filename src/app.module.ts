import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Configuration } from './config/configuration';
import { SocketModule } from './modules/socket/socket.module';
import { HorseRaceModule } from './modules/horserace/horserace.module';
import { MongooseConfigService } from './config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { InitRoomsProvider } from './providers/initrooms/init.rooms.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [Configuration] }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    AuthModule,
    UserModule,
    SocketModule,
    HorseRaceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    InitRoomsProvider
  ],
})
export class AppModule { }
