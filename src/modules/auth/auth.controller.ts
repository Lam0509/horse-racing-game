import { Body, Controller, Logger, Req } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { LoginRequestDto } from './auth.dto';
import { LoginResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtLoginPayload } from 'src/providers/token/token.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
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
  logOut(@Req() req: Request & { user: JwtLoginPayload }): { message: string } {
    try {
      const { user } = req;
      this.authService.logOut(user);
      return {
        message: 'Logout successfully!',
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
