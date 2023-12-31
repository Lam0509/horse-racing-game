import { Injectable, Logger } from '@nestjs/common';
import { JwtLoginPayload } from './token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(private readonly jwtService: JwtService) {}

  signJwt(payload: JwtLoginPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verifyJwt(token: string): Promise<JwtLoginPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
