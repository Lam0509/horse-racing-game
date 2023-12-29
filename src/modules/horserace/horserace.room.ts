import { UserDocument } from '../user/user.schema';

export class HorseRaceRoom {
    readonly id: string;
    name: string;
    users: UserDocument[] = [];
    private readonly maxUsers: number;
    isReady: boolean = false;
    bets: Map<string, number> = new Map

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

    removeUser(userId: string): boolean {
        let index: number = this.users.findIndex(user => user.id == userId);
        if (index < 0) return false;
        delete this.users[index]['roomId'];
        this.users.splice(index, 1);
        return true;
    }

    bet(userId: string, money: number) {
        
    }
}