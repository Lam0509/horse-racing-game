import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History, HistorySchema } from './history.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
