import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HistoryDocument = HydratedDocument<History>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class History {
  @Prop({
    type: String,
    required: true,
  })
  gameId: string;

  @Prop({
    type: Number,
    required: true,
  })
  bet: number;

  @Prop({
    type: Number,
    required: true,
  })
  betOption: any;

  @Prop({
    type: Number,
    default: 0,
  })
  reward?: number;

  @Prop({
    type: String,
  })
  userAddress: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
