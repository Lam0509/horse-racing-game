import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/modules/user/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {

    private readonly users: Map<string, UserDocument> = new Map();

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl);
    }

    async get<T>(key: string): Promise<T> {
        return await this.cacheManager.get<T>(key);
    }

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