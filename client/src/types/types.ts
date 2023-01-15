import type { Socket as ioSocket } from "socket.io-client";

export type Bid = {
  playerId: string;
  action: string;
  amount?: number;
  dice?: number;
};

export type Player = {
  playerName: string;
  dice?: number[];
  diceCount: number;
  disconnected: boolean;
};

export type EndOfRoundDice = {
  playerName: string;
  dice: number[];
};

export type Notification = {
  title: string;
  description: string;
};

export type Socket = {
  socket: ioSocket;
  name: string;
  roomCode: string;
  players: Player[];
  notificationLog: Notification[];
  playersTurn: string;
  canBid: boolean;
  latestBid: Bid;
};
