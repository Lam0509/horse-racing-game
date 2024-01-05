import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: [true, 'Address required!'],
    unique: true,
  })
  address: string;

  @Prop({
    type: String,
    required: [true, 'Access token required!'],
    unique: true,
  })
  accessToken: string;

  // socketId?: string;
  // roomId?: string;
  // isReady?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
