import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import depositMoneyAbi from '../contract/abi/DepositMoney.json';

@Injectable()
export class EvmService {
  private readonly logger = new Logger(EvmService.name);
  private readonly signedMessage: string;
  private readonly chainRpc: string;
  private readonly depositMoneyContractAddress: string;
  private readonly provider: ethers.JsonRpcProvider;

  constructor(private readonly configService: ConfigService) {
    this.signedMessage = this.configService.get<string>('signedMessage');
    this.chainRpc = this.configService.get<string>('chainRpc');
    this.depositMoneyContractAddress = this.configService.get<string>(
      'depositMoneyContractAddress',
    );
    this.provider = new ethers.JsonRpcProvider(this.chainRpc);
  }

  getDepositMoneyContract(): ethers.Contract {
    return new ethers.Contract(
      this.depositMoneyContractAddress,
      depositMoneyAbi,
      this.provider,
    );
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
