import { UserDocument } from '../user/user.schema';

export interface HorseRaceRoomInfo {
  id: string;
  name: string;
  currentUsers: number;
  maxUsers: number;
}

export interface HorseRaceUser extends UserDocument {
  roomId: string;
  isReady: boolean;
}
