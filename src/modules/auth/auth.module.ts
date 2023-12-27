import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EvmModule } from '../evm/evm.module';
import { TokenModule } from 'src/providers/token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EvmModule, TokenModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
