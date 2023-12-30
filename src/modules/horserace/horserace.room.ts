import { UserDocument } from '../user/user.schema';
import { History } from '../history/history.schema';
import { HORSE } from './horserace.constant';
import { Utils } from '../../providers/utils/ultils.service';

export class HorseRaceRoom {
    readonly id: string;
    name: string;
    users: UserDocument[] = [];
    private readonly maxUsers: number;
    bets: History[] = [];
    result: number[];

    constructor(id: string, name: string, maxUsers: number = 4) {
        this.id = id;
        this.name = name;
        this.maxUsers = maxUsers;
    }

    addUser(user: UserDocument): boolean {
        if (this.users.length >= this.maxUsers) return false;
        this.users.push(user);
        user['roomId'] = this.id;
    }

    removeUser(address: string): boolean {
        let index: number = this.users.findIndex(user => user.address == address);
        if (index < 0) return false;
        delete this.users[index]['roomId'];
        this.users.splice(index, 1);
        return true;
    }

    addBet(gameId: string, userAddress: string, money: number, horse: number): void {
        this.bets.push({
            gameId,
            userAddress,
            bet: money,
            betOption: horse
        });
        this.users.find(user => user.address == userAddress).isReady = true;
    }

    get isReady(): boolean {
        return this.users.every(user => user.isReady);
    }

    generateResult(): number[] {
        this.result =  Utils.shuffleArray<number>(Object.values(HORSE));
        return this.result;
    }

    updateReward() {
        this.bets.forEach(bet => bet.betOption == this.result && bet.reward == bet.bet);
    }

    get winningBets(): History[] {
        return this.bets.filter(bet => bet.betOption == this.result[0]);
    }
}