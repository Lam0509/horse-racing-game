import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly accessTokenExpiry: string;
  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('security.jwtSecret');
    this.accessTokenExpiry = this.configService.get<string>(
      'security.accessTokenExpiry',
    );
  }

  signJwt(payload: object): string {
    const options = {
      expiresIn: this.accessTokenExpiry,
    };
    return jwt.sign(payload, this.jwtSecret, options);
  }

  verifyJwt(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
}
