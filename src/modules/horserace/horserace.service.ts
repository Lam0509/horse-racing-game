import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { HORSE_RACE_EVENT } from './horserace.event.constant';
import { HorseRaceRoom } from './horserace.room';

@Injectable()
export class HorseRaceService {

  readonly rooms: HorseRaceRoom[] = [];

  constructor() {}

  handleConnection(socket: Socket) {
    if (socket.handshake.query.gameId !== 'horse-race') return;
    socket.emit(HORSE_RACE_EVENT.SEND_INFO, 'horse race game');
  }

  handleDisconnect(socket: Socket) {
    // Handle disconnect
  }

  searchRooms(roomId: string): HorseRaceRoom[] {
    return this.rooms.filter(room => room.id.includes(roomId));
  }

  getRoomById(roomId: string): HorseRaceRoom {
    return this.rooms.find(room => room.id == roomId);
  }

}
