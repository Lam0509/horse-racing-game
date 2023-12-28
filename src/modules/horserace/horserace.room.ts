import { UserDocument } from '../user/user.schema';

export class HorseRaceRoom {
    readonly id: string;
    name: string;
    users: UserDocument[] = [];
    private readonly maxUsers: number;


    constructor(id: string, name: string, maxUsers: number = 4) {
        this.id = id;
        this.name = name;
        this.maxUsers = maxUsers;
    }

    addUser(user: UserDocument): boolean {
        if (this.users.length >= this.maxUsers) return false;
        this.users.push(user)
    }

    removeUser(userId: string): void {
        this.users = this.users.filter(user => user.id !== userId);
    }
}