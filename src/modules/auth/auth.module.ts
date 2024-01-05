import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EvmModule } from '../../providers/evm/evm.module';
import { UserModule } from '../user/user.module';
import { TokenModule } from 'src/providers/token/token.module';
import { CacheModule } from 'src/providers/cache/cache.module';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TokenModule, EvmModule, UserModule, CacheModule],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
