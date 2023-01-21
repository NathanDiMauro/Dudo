import type { Bid, Error as _error } from "../../../shared/types";
import { Socket } from "../index";
import { createRoom as stateCreateRoom } from "../state";
import { ValidationErrorName } from "./error";
import { addPlayer } from "./utils";

export const registerHandlers = (socket: Socket) => {
  // TODO generate this room code.
  const roomCode = "1234";

  const createRoom = (name: string, callback: (error: _error) => void) => {
    try {
      stateCreateRoom(name);
      addPlayer(socket, name, roomCode);
    } catch (e: any) {
      if (e.name == ValidationErrorName) {
        callback(e.message);
      } else {
        console.error(e);
      }
      return;
    }
  };

  const joinRoom = (
    name: string,
    roomCode: string,
    callback: (error: _error) => void
  ) => {};

  const startGame = (callback: (error: _error) => void) => {};

  const bid = (bid: Bid, callback: (error: _error) => void) => {};

  const sendMessage = (
    message: string,
    callback: (error: _error) => void
  ) => {};

  const reconnect = (socketId: string, callback: (error: _error) => void) => {};

  const disconnect = () => void {};

  socket.on("createRoom", createRoom);
  socket.on("joinRoom", joinRoom);
  socket.on("startGame", startGame);
  socket.on("bid", bid);
  socket.on("sendMessage", sendMessage);

  socket.on("reconnect", reconnect);
  socket.on("disconnect", disconnect);
};
