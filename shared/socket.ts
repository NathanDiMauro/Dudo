import type { Bid, Error, Notification, Player, PlayerBrief, PlayerEndOfRound } from "./types";

export interface ServerToClientEvents {
  diceForRound: (dice: number[]) => void;
  turn: (playerName: string) => void;
  players: (players: PlayerBrief[]) => void;
  notification: (notification: Notification) => void;
  newBid: (bid: Bid) => void;
  endOfRound: (message: string, players: PlayerEndOfRound[]) => void;
}

export interface ClientToServerEvents {
  createRoom: (name: string, callback: (roomCode: string, error: Error) => void) => void;
  joinRoom: (name: string, roomCode: string, callback: (error: Error) => void) => void;
  startGame: (callback: (error: Error) => void) => void;
  bid: (bid: Bid, callback: (error: Error) => void) => void;
  sendMessage: (message: string, callback: (error: Error) => void) => void;
  reconnect: (socketId: string, callback: (error: Error) => void) => void;
  disconnect: () => void;
}
