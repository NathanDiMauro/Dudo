import type { Bid, Error, Notification, Player, PlayerBrief, PlayerEndOfRound } from "./types";

export type Response = {
  Error?: Error;
  Message?: string;
};

export type CreateRoomResponse = Response & {
  RoomCode?: string;
};

export type ReconnectResponse = Response & {
  RoomCode?: string;
  PlayerName?: string;
};

export interface ServerToClientEvents {
  diceForRound: (dice: number[]) => void;
  turn: (playerName: string) => void;
  players: (players: PlayerBrief[]) => void;
  notification: (notification: Notification) => void;
  newBid: (bid: Bid) => void;
  endOfRound: (message: string, players: PlayerEndOfRound[]) => void;
}

export interface ClientToServerEvents {
  createRoom: (name: string, callback: (resp: CreateRoomResponse) => void) => void;
  joinRoom: (name: string, roomCode: string, callback: (resp: Response) => void) => void;
  startGame: (callback: (resp: Response) => void) => void;
  bid: (bid: Bid, callback: (resp: Response) => void) => void;
  sendMessage: (message: string, callback: (resp: Response) => void) => void;
  reconnect: (socketId: string, callback: (resp: ReconnectResponse) => void) => void;
  disconnect: () => void;
}
