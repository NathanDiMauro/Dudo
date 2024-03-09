import type { Socket as ioSocket } from "socket.io-client";
import type { Bid, Notification, Player } from "../../../shared/types";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../../shared/socket";

export type Socket = {
  socket: ioSocket<ServerToClientEvents, ClientToServerEvents>;
  name: string;
  roomCode: string;
  players: Player[];
  notificationLog: Notification[];
  playersTurn: string;
  canBid: boolean;
  latestBid: Bid;
};
