import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EvmService } from '../evm/evm.service';
import { LoginResponseDto } from './auth.dto';
import { TokenService } from 'src/providers/token/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly evmService: EvmService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async logIn(
    address: string,
    signedMessage: string,
  ): Promise<LoginResponseDto> {
    this.logger.log(`User have address ${address} log in ...`);
    // Verify message
    const verifyResult = await this.evmService.verifyMessage(
      address,
      signedMessage,
    );
    if (!verifyResult) {
      this.logger.log(`Log in unsuccessfully because can not verify message!`);
      throw new UnauthorizedException();
    }

    const payload = { address };
    // Gen access token
    const accessToken = await this.tokenService.signJwt(payload);
    if (!accessToken) {
      this.logger.log(`Generate token unsuccessfully!`);
      throw new BadRequestException();
    }

    // Save address to database
    const user = { address, accessToken };
    const result = await this.userService.create(user);
    if (!result) {
      this.logger.log(`Save user info unsuccessfully!`);
      throw new BadRequestException();
    }

    return { accessToken };
  }
}
