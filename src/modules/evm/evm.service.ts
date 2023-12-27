import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EvmService {
  private readonly logger = new Logger(EvmService.name);
  private readonly signedMessage: string;

  constructor(private readonly configService: ConfigService) {
    this.signedMessage = this.configService.get<string>('signedMessage');
  }

  // Verify Message
  async verifyMessage(
    address: string,
    signedMessage: string,
  ): Promise<boolean> {
    const signer = await ethers.verifyMessage(
      this.signedMessage,
      signedMessage,
    );
    return signer === address;
  }
}
