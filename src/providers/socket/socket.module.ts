import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { UserModule } from '../../modules/user/user.module';
import { CacheModule } from 'src/providers/cache/cache.module';
import { TokenModule } from 'src/providers/token/token.module';

@Module({
  imports: [UserModule, CacheModule, TokenModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
