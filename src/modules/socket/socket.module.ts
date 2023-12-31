import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { UserModule } from '../user/user.module';
import { CacheModule } from 'src/providers/cache/cache.module';
import { TokenModule } from 'src/providers/token/token.module';

@Module({
  imports: [UserModule, CacheModule, TokenModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
