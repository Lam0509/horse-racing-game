import { Module } from '@nestjs/common';
import { UtilsService } from './ultils.service';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UltilsModule {}
