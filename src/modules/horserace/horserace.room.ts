import { UserDocument } from '../user/user.schema';
import { History } from '../history/history.schema';
import { HORSE } from './horserace.constant';
import { Utils } from '../../providers/utils/ultils.service';
import ShortUniqueId from 'short-unique-id';
import { HorseRaceRoomInfo } from './horserace.interface';

export class HorseRaceRoom {
  private static readonly uid = new ShortUniqueId({ length: 6 });

  readonly id: string;
  readonly maxUsers: number;
  name: string;
  users: UserDocument[] = [];
  bets: History[] = [];
  result: number[];
  currentUsers: number = 0;

  constructor(name: string, maxUsers: number = 4) {
    this.id = HorseRaceRoom.uid.rnd();
    this.name = name;
    this.maxUsers = maxUsers;
  }

  addUser(user: UserDocument): boolean {
    if (this.users.length >= this.maxUsers) return false;
    this.users.push(user);
    user['roomId'] = this.id;
    this.currentUsers = this.users.length;
  }

  removeUser(address: string): boolean {
    let index: number = this.users.findIndex((user) => user.address == address);
    if (index < 0) return false;
    delete this.users[index]['roomId'];
    this.users.splice(index, 1);
    this.currentUsers = this.users.length;
    return true;
  }

  addBet(
    gameId: string,
    userAddress: string,
    money: number,
    horse: number,
  ): void {
    this.bets.push({
      gameId,
      userAddress,
      bet: money,
      betOption: horse,
    });
    this.users.find((user) => user.address == userAddress).isReady = true;
  }

  get isReady(): boolean {
    return this.users.every((user) => user.isReady);
  }

  generateResult(): number[] {
    this.result = Utils.shuffleArray<number>(Object.values(HORSE));
    return this.result;
  }

  updateReward() {
    this.bets.forEach(
      (bet) => bet.betOption == this.result && bet.reward == bet.bet,
    );
  }

  get winningBets(): History[] {
    return this.bets.filter((bet) => bet.betOption == this.result[0]);
  }

  get info(): HorseRaceRoomInfo {
    return {
      id: this.id,
      name: this.name,
      currentUsers: this.currentUsers,
      maxUsers: this.maxUsers,
    };
  }
}
