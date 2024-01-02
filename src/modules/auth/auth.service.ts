import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EvmService } from '../evm/evm.service';
import { LoginResponseDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { TokenService } from 'src/providers/token/token.service';
import { CacheService } from 'src/providers/cache/cache.service';
import { JwtLoginPayload } from 'src/providers/token/token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly evmService: EvmService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
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

    // Save in redis
    await this.cacheService.set(address, accessToken);

    return { accessToken };
  }

  async logOut(user: JwtLoginPayload): Promise<void> {
    // Remove from redis
    await this.cacheService.delete(user.address);

    // Change in db
    await this.userService.removeAccessToken(user.address);

    return;
  }
}
