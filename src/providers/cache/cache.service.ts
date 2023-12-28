import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/modules/user/user.schema';

@Injectable()
export class CacheService {

    private readonly users: Map<string, UserDocument> = new Map();

    addUser(user: UserDocument): void {
        this.users.set(user.address, user);
    }

    getUser(address: string): UserDocument {
        return this.users.get(address);
    }

    deleteUser(address: string): void {
        this.users.delete(address);
    }
}