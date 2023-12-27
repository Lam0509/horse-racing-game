import { Injectable, Logger } from '@nestjs/common';
import { EvmService } from '../evm/evm.service';
import { LoginResponseDto } from './auth.dto';
import { TokenService } from 'src/providers/token/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly evmService: EvmService,
    private readonly tokenService: TokenService,
  ) {}

  async logIn(
    address: string,
    signedMessage: string,
  ): Promise<LoginResponseDto> {
    try {
      this.logger.log(`User have address ${address} log in ...`);
      const verifyResult = await this.evmService.verifyMessage(
        address,
        signedMessage,
      );
      if (!verifyResult) {
        this.logger.log(
          `Log in unsuccessfully because can not verify message!`,
        );
        return;
      }
      const payload = { address };
      const accessToken = await this.tokenService.signJwt(payload);
      return { accessToken };
    } catch (err) {
      this.logger.error(err);
    }
  }
}
