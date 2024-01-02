import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EvmModule } from '../evm/evm.module';
import { UserModule } from '../user/user.module';
import { TokenModule } from 'src/providers/token/token.module';
import { CacheModule } from 'src/providers/cache/cache.module';

@Module({
  imports: [TokenModule, EvmModule, UserModule, CacheModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
