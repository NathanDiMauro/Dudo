import { createServer } from "http";
import { Server, Socket } from "socket.io";

import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "../../shared/socket";

// import { defaultConfig as config } from "../config/default";

// const port = config["port"];
// const host = config["host"];
// const corsOrigin = config["corsOrigin"];
// const methods = config["methods"];

const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);



io.on("connection", (socket: Socket) => {
	socket.on("createRoom", (name: string, callback) => {
		// try {
		// 	const { error } = createRoom(roomCode);
		// 	if (error) return callback(error);
		// 	_addPlayer(socket, name, roomCode, callback);
		//   } catch (e) {
		// 	console.log(e);
		//   }
	})
})