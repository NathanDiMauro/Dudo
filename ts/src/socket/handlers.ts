import type { Bid, Error } from "../../../shared/types";

export const createRoom = (
  name: string,
  callback: (name: string, roomCode: string, error: Error) => void
) => void {};

export const joinRoom = (
  name: string,
  roomCode: string,
  callback: (name: string, roomCode: string, error: Error) => void
) => void {};

export const startGame = (callback: (error: Error) => void) => void {};

export const bid = (bid: Bid, callback: (error: Error) => void) => void {};

export const sendMessage = (
  message: string,
  callback: (error: Error) => void
) => void {};

export const reconnect = (socketId: string, callback: (error: Error) => void) =>
  void {};

export const disconnect = () => void {};
