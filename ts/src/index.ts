import { createServer } from "http";
import { Server, Socket as ioSocket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../shared/socket";
import { localConfig } from "../config/local";
import {
  bid,
  createRoom,
  disconnect,
  joinRoom,
  reconnect,
  sendMessage,
  startGame,
} from "./socket/handlers";

// Define our own Socket type for simplicity.
export type Socket = ioSocket<ClientToServerEvents, ServerToClientEvents>;

// Create the HTTP server.
const httpServer = createServer();
httpServer.listen(localConfig["port"], localConfig["host"], () => {
  // TODO See if we have to listen to the post using the HTTP server.
  console.log(`Listening on port ${localConfig["port"]}`);
});

// Initial Socket IO server with the
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: localConfig["corsOrigin"],
    methods: localConfig["methods"],
  },
});

// TODO reference this SO post for how to better organize the socket handlers:
// https://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app

io.on("connection", (socket: Socket) => {
  // Set up the handlers for incoming socket events
  //   socket.on("createRoom", createRoom);
  socket.on("createRoom", createRoom);
  socket.on("joinRoom", joinRoom);
  socket.on("startGame", startGame);
  socket.on("bid", bid);
  socket.on("sendMessage", sendMessage);

  socket.on("reconnect", reconnect);
  socket.on("disconnect", disconnect);
});
