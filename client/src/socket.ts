import { io, Socket as ioSocket } from "socket.io-client";

const ENDPOINT = "127.0.0.1:5000";

export function newSocket(): ioSocket {
  // Calling io, passing ENDPOINT and some other configs -- transports is to avoid CORS issues

  const socket = io(ENDPOINT, { transports: ["websocket", "polling"] });

  return socket;
}
