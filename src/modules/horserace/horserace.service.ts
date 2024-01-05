import { Injectable } from '@nestjs/common';
import { HorseRaceRoom } from './horserace.room';
import { HorseRaceUser } from './horserace.interface';
import { CacheService } from 'src/providers/cache/cache.service';

@Injectable()
export class HorseRaceService {
  private rooms: HorseRaceRoom[] = [];

  constructor(private readonly cacheService: CacheService) {}

  get listRooms() {
    return this.rooms;
  }

  getRoom(roomId: string): HorseRaceRoom | undefined {
    return this.rooms.find((room) => room.id == roomId);
  }

  deleteRoom(roomId: string): void {
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
  }

  createRoom(name: string, bet: number, address: string): HorseRaceRoom {
    const user = this.cacheService.getUser(address);
    // Return if user already in a room
    if (user.roomId) return;

    // Create a new room
    const newRoom = new HorseRaceRoom(name, bet);

    // Save cache
    user.roomId = newRoom.id;
    user.isReady = false;
    this.cacheService.addUser(user);

    // Add user to room
    newRoom.addUser(user);
    this.rooms.push(newRoom);
    return newRoom;
  }

  joinRoom(roomId: string, address: string): HorseRaceUser {
    const room = this.getRoom(roomId);
    // Return if no room found or enough users
    if (!room || room.checkEnoughUsers()) return;

    const user = this.cacheService.getUser(address);
    // Return if user already in a room
    if (user.roomId) return;

    user.roomId = roomId;
    user.isReady = false;

    // Return if can not add user to room
    if (!room.addUser(user)) return;

    // Save cache
    this.cacheService.addUser(user);
    return user;
  }

  leaveRoom(address: string): {
    updatedUsers: HorseRaceUser[];
    roomId: string;
  } {
    const user = this.cacheService.getUser(address);
    // Return if user not in a room
    if (!user.roomId) return;

    const room = this.getRoom(user.roomId);
    // Return if no room found or game is in progress
    if (!room || room.checkIsInGame()) return;

    user.roomId = null;
    user.isReady = false;

    const updatedUsers = room.removeUser(user);
    if (!updatedUsers) return;

    // Save cache
    this.cacheService.addUser(user);
    return { updatedUsers, roomId: room.id };
  }

  changeUserStatusInRoom(address: string): HorseRaceUser {
    const user = this.cacheService.getUser(address);
    // Return if user not in a room
    if (!user.roomId) return;

    const room = this.getRoom(user.roomId);
    // Return if no room found
    if (!room || room.checkIsInGame()) return;

    user.isReady = !user.isReady;

    const result = room.changeStatusForUser(user);
    if (!result) return;

    // Save cache
    this.cacheService.addUser(user);
    return user;
  }

  checkRoomIsReady(roomId: string): boolean {
    const room = this.getRoom(roomId);
    return room.isReady();
  }

  getRoomWinner(roomId: string): HorseRaceUser {
    const room = this.getRoom(roomId);
    return room.generateResult();
  }

  updateUsersWhenFinished(roomId: string): void {
    const room = this.getRoom(roomId);
    for (const user of room.users) {
      user.roomId = null;
      user.isReady = false;
      this.cacheService.addUser(user);
    }
  }
}
