import { writable } from "svelte/store";
import { io, Socket as ioSocket } from "socket.io-client";

const ENDPOINT = "127.0.0.1:5000";

// Calling io, passing ENDPOINT and some other configs -- transports is to avoid CORS issues
const socket = io(ENDPOINT, { transports: ["websocket", "polling"] });

export type Player = {
  name: string;
  dice?: string[];
  diceCount: number;
  disconnected: boolean;
};

export type Notification = {
  title: string;
  description: string;
};

type Socket = {
  socket: ioSocket;
  name: string;
  roomCode: string;
  players: Player[];
  notificationLog: Notification[];
  playersTurn: string;
  canBid: boolean;
};

const SocketStore = writable<Socket>({
  socket: socket,
  name: "",
  roomCode: "",
  players: [],
  notificationLog: [],
  playersTurn: "",
  canBid: false,
});

export default SocketStore;
