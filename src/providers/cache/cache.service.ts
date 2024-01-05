import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/modules/user/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HorseRaceUser } from 'src/modules/horserace/horserace.interface';

@Injectable()
export class CacheService {
  private readonly users: Map<string, HorseRaceUser> = new Map();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Redis
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  // Redis
  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get<T>(key);
  }

  // Redis
  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  addUser(user: HorseRaceUser): void {
    this.users.set(user.address, user);
  }

  getUser(address: string): HorseRaceUser {
    return this.users.get(address);
  }

  deleteUser(address: string): void {
    this.users.delete(address);
  }
}
