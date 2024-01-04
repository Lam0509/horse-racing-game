import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { UserModule } from '../../modules/user/user.module';
import { CacheModule } from 'src/providers/cache/cache.module';
import { TokenModule } from 'src/providers/token/token.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [UserModule, CacheModule, TokenModule],
  providers: [SocketService, SocketGateway],
  exports: [SocketService],
})
export class SocketModule {}
