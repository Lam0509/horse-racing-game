import { Body, Controller, Logger } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { LoginRequestDto } from './auth.dto';
import { LoginResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async logIn(
    @Body() { address, signedMessage }: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    try {
      return await this.authService.logIn(address, signedMessage);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Post('/logout')
  async logOut(): Promise<void> {
    try {
      return await this.authService.logOut();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
