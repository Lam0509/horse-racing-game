import { UserDocument } from '../user/user.schema';
import { History } from '../history/history.schema';
import { Utils } from '../../providers/utils/ultils.service';
import ShortUniqueId from 'short-unique-id';
import { HorseRaceRoomInfo, HorseRaceUser } from './horserace.interface';
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

  //   removeUser(address: string): boolean {
  //     let index: number = this.users.findIndex((user) => user.address == address);
  //     if (index < 0) return false;
  //     delete this.users[index]['roomId'];
  //     this.users.splice(index, 1);
  //     this.currentUsers = this.users.length;
  //     return true;
  //   }

  //   addBet(
  //     gameId: string,
  //     userAddress: string,
  //     money: number,
  //     horse: number,
  //   ): void {
  //     this.bets.push({
  //       gameId,
  //       userAddress,
  //       bet: money,
  //       betOption: horse,
  //     });
  //     this.users.find((user) => user.address == userAddress).isReady = true;
  //   }

  //   get isReady(): boolean {
  //     return this.users.every((user) => user.isReady);
  //   }

  //   updateReward() {
  //     this.bets.forEach(
  //       (bet) => bet.betOption == this.result && bet.reward == bet.bet,
  //     );
  //   }

  //   get winningBets(): History[] {
  //     return this.bets.filter((bet) => bet.betOption == this.result[0]);
  //   }

  //   get info(): HorseRaceRoomInfo {
  //     return {
  //       id: this.id,
  //       name: this.name,
  //       currentUsers: this.currentUsers,
  //       maxUsers: this.maxUsers,
  //     };
  //   }
}
