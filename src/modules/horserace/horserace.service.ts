import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { HORSE_RACE_EVENT } from './horserace.event.constant';

@Injectable()
export class HorseRaceService {
  constructor() {}

  handleConnection(socket: Socket) {
    if (socket.handshake.query.gameId !== 'horse-race') return;
    socket.emit(HORSE_RACE_EVENT.SEND_INFO, 'horse race game');
  }

  handleDisconnect(socket: Socket) {
    // Handle disconnect
  }
}
