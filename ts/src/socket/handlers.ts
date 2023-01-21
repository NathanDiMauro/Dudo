import type { Bid, Error } from "../../../shared/types";
import { Socket } from "../index";
import { createRoom as stateCreateRoom } from "../state";

export const registerHandlers = (socket: Socket) => {
  const createRoom = (
    name: string,
    callback: (name: string, roomCode: string, error: Error) => void
  ) => {
    const res = stateCreateRoom(name);
    if (res) {
      callback(name, "", res);
    }
  };

  const joinRoom = (
    name: string,
    roomCode: string,
    callback: (name: string, roomCode: string, error: Error) => void
  ) => {};

  const startGame = (callback: (error: Error) => void) => {};

  const bid = (bid: Bid, callback: (error: Error) => void) => {};

  const sendMessage = (message: string, callback: (error: Error) => void) => {};

  const reconnect = (socketId: string, callback: (error: Error) => void) => {};

  const disconnect = () => void {};

  socket.on("createRoom", createRoom);
  socket.on("joinRoom", joinRoom);
  socket.on("startGame", startGame);
  socket.on("bid", bid);
  socket.on("sendMessage", sendMessage);

  socket.on("reconnect", reconnect);
  socket.on("disconnect", disconnect);
};
