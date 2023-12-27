import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly jwtSecret: string;
  private readonly accessTokenExpiry: string;
  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('security.jwtSecret');
    this.accessTokenExpiry = this.configService.get<string>(
      'security.accessTokenExpiry',
    );
  }

  signJwt(payload: object): string {
    try {
      const options = {
        expiresIn: this.accessTokenExpiry,
      };
      return jwt.sign(payload, this.jwtSecret, options);
    } catch (err) {
      this.logger.error(err);
    }
  }

  verifyJwt(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
}
