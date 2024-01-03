import { Injectable } from '@nestjs/common';
import { HorseRaceRoom } from './horserace.room';
import { HorseRaceRoomInfo } from './horserace.interface';

@Injectable()
export class HorseRaceService {

  private readonly rooms: HorseRaceRoom[] = [];

  constructor() { }

  searchRooms(roomId: string): HorseRaceRoomInfo[] {
    return this.rooms.filter(room => room.id.includes(roomId)).map(room => room.info);
  }

  getRoom(roomId: string): HorseRaceRoom {
    return this.rooms.find(room => room.id == roomId);
  }

  deleteRoom(roomId: string): void {
    this.rooms.filter(room => room.id != roomId);
  }

  createRoom(count: number = 1): void {
    for (let i = 0; i < count; i++) {
      this.rooms.push(new HorseRaceRoom(`Room ${Math.floor(Math.random() * 1000)}`));
    }
  }

  initRooms(count: number): void {
    for (let i = 0; i < count; i++) {
      this.createRoom();
    }
  }

  get listRooms(): HorseRaceRoomInfo[] {
    return this.rooms.map(room => room.info);
  }

  get listRoomIds(): string[] {
    return this.rooms.map(room => room.id);
  }

  get roomCount(): number {
    return this.rooms.length;
  }
}
