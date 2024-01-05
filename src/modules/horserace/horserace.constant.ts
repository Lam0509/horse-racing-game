export const HORSE_RACE_EVENT = {
  ROOMS: 'horse_race_rooms',
  CREATE_ROOM: 'horse_race_create_room',
  JOIN_ROOM: 'horse_race_join_room',
  READY_OR_NOT: 'horse_race_ready_or_not',
  LEAVE_ROOM: 'horse_race_leave_room',
};

export enum RoomStatus {
  WAITING = 'waiting',
  STARTED = 'started',
}
