import { Utils } from '../../providers/utils/ultils.service';
import ShortUniqueId from 'short-unique-id';
import { HorseRaceUser } from './horserace.interface';
import { RoomStatus } from './horserace.constant';

export class HorseRaceRoom {
  private static readonly uid = new ShortUniqueId({ length: 6 });

  readonly id: string;
  name: string;
  readonly maxUsers: number;
  users: HorseRaceUser[] = [];
  bet: number = 0;
  status: RoomStatus = RoomStatus.WAITING;
  winner: HorseRaceUser;

  constructor(name: string, bet: number, maxUsers: number = 4) {
    this.id = HorseRaceRoom.uid.rnd();
    this.name = name;
    this.bet = bet;
    this.maxUsers = maxUsers;
  }

  findUserIndex(address: string): number {
    return this.users.findIndex(
      (user: HorseRaceUser) => user.address === address,
    );
  }

  addUser(user: HorseRaceUser): boolean {
    const index = this.findUserIndex(user.address);
    if (index === -1 && this.users.length < this.maxUsers) {
      this.users.push(user);
      return true;
    }
    return false;
  }

  changeStatusForUser(user: HorseRaceUser): boolean {
    const index = this.findUserIndex(user.address);
    if (index === -1) return false;
    this.users.splice(index, 1, user);
    return true;
  }

  removeUser(user: HorseRaceUser): HorseRaceUser[] {
    const index = this.findUserIndex(user.address);
    if (index === -1) return;
    this.users.splice(index, 1);
    return this.users;
  }

  checkEnoughUsers(): boolean {
    return this.users.length === this.maxUsers;
  }

  checkIsInGame(): boolean {
    return this.status === RoomStatus.STARTING;
  }

  isReady(): boolean {
    return (
      this.users.every((user) => user.isReady) &&
      this.users.length === this.maxUsers
    );
  }

  generateResult(): HorseRaceUser {
    this.winner = Utils.randomFromArray<HorseRaceUser>(this.users);
    return this.winner;
  }
}
