import { Socket } from 'socket.io';

export type SocketUser = Socket & {
  address?: string;
};
