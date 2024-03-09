import { CreateRoomResponse, ReconnectResponse, Response } from "../../../shared/socket";
import type { Bid, Error as _error, EndOfRound, Player } from "../../../shared/types";
import { Socket, io } from "../index";
import { getRoom, createRoom as stateCreateRoom, getRoom as stateGetRoom } from "../state";
import { ValidationErrorName, validationError } from "./error";
import { addPlayer, notifyWhoseTurn, sendNotification, sendPlayers, startRound } from "./utils";

/**
 * Generate a random three character string.
 * @returns {string} The random room code
 */
const generateRoomCode = (): string => {
  // https://www.programiz.com/javascript/examples/generate-random-strings
  return Math.random().toString(36).substring(3, 6);
};

export const registerHandlers = (socket: Socket) => {
  const createRoom = (name: string, callback: (resp: CreateRoomResponse) => void) => {
    const roomCode = generateRoomCode();
    try {
      stateCreateRoom(roomCode);
      addPlayer(socket, name, roomCode);
    } catch (e: any) {
      if (e.name === ValidationErrorName) {
        callback({ Error: e });
      } else {
        callback;
      }
      return;
    }
    callback({ RoomCode: roomCode, Message: "Room created" });
  };

  const joinRoom = (name: string, roomCode: string, callback: (resp: Response) => void) => {
    try {
      addPlayer(socket, name, roomCode);
    } catch (e: any) {
      if (e.name === ValidationErrorName) {
        callback({ Error: e });
      } else {
        console.error(e);
      }
      return;
    }
  };

  // TODO simplify this handler. Put most of the login in the Room class.
  const startGame = (callback: (resp: Response) => void) => {
    try {
      const room = stateGetRoom(socket.id);
      if (room === undefined) {
        callback({ Message: "Room does not exist." });
        return;
      }

      if (room.roundStarted) {
        callback({ Message: "Round is in progress." });
        return;
      }

      // Let players know the game is starting
      let notif = {
        title: "New Round is Starting",
        description: "A new round is starting",
      };
      // If playerWhoJustLost is undefined, the game is starting.
      if (!room.playerWhoJustLost) {
        notif = {
          title: "Game is starting",
          description: "The game is starting",
        };
      }

      sendNotification(notif, room.roomCode);
      room.newRound();
      startRound(room);
    } catch (e: any) {
      if (e.name === ValidationErrorName) {
        callback({ Error: e.message });
      } else {
        console.error(e);
      }
      return;
    }
  };

  const bid = (bid: Bid, callback: (resp: Response) => void) => {
    try {
      const room = getRoom(socket.id);
      if (room === undefined) {
        callback({ Message: "Room does not exist" });
        return;
      }
      const player = room.getPlayer(socket.id);
      if (player === undefined) {
        callback({ Message: "Unable to find player" });
        return;
      }

      const res = room.bid(bid);

      // Check if the bid ended the round.
      if ((res as EndOfRound).players) {
        const eor = res as EndOfRound;
        io.in(room.roomCode).emit("endOfRound", eor.msg, eor.players);
        sendNotification({ title: "Round is over", description: "res.eor.msg" }, room.roomCode);
        return;
      }
      // TODO send bid? Is this handled somewhere else?
    } catch (e: any) {
      if (e.name === ValidationErrorName) {
        callback({ Error: e.message });
      } else {
        console.error(e);
      }
      return;
    }
  };

  const sendMessage = (message: string, callback: (resp: Response) => void) => {
    try {
      const room = getRoom(socket.id);
      if (room === undefined) {
        callback({ Message: "Unable to find room" });
        return;
      }
      const player = room.getPlayer(socket.id);
      if (player === undefined) {
        callback({ Message: "Unable to find player" });
        return;
      }
      sendNotification({ title: player.playerName, description: message }, room.roomCode);
    } catch (e: any) {
      if (e.name === validationError) {
        callback({ Message: e.msg });
      } else {
        console.error(e);
      }
      return;
    }
  };

  const reconnect = (socketId: string, callback: (resp: ReconnectResponse) => void) => {
    try {
      const room = getRoom(socketId);
      if (room === undefined) {
        callback({ Error: { msg: "Unable to find room" } });
        return;
      }
      const player = room.getPlayer(socketId);
      if (player === undefined) {
        callback({ Error: { msg: "Unable to find player" } });
        return;
      }
      player.id = socket.id;
      player.disconnected = false;
      socket.join(room.roomCode);
      sendPlayers(room.roomCode);
      sendNotification(
        { title: `${player.playerName} reconnected`, description: "" },
        room.roomCode
      );
      callback({ RoomCode: room.roomCode, PlayerName: player.playerName });
      // TODO update this callback to reflect to js version. (? what ?)
    } catch (e: any) {
      if (e.name === validationError) {
        callback({ Error: e });
      } else {
        console.error(e);
      }
      return;
    }
  };

  const disconnect = () => {
    try {
      const room = getRoom(socket.id);
      if (room === undefined) {
        socket.disconnect();
        return;
      }
      const player = room.getPlayer(socket.id);
      if (player === undefined) {
        socket.disconnect();
        return;
      }
      player.disconnected = true;
      sendPlayers(room.roomCode);
      sendNotification(
        {
          title: `${player.playerName} just disconnected`,
          description: "They have 10 seconds to reconnect",
        },
        room.roomCode
      );

      setTimeout(() => {
        try {
          if (!player.disconnected) return;
          const removedPlayer = room.removePlayer(player.id);
          if (removedPlayer === undefined) return;
          sendNotification(
            {
              title: "Someone just left",
              description: `${removedPlayer.playerName} just left the room`,
            },
            room.roomCode
          );
          sendPlayers(room.roomCode);
          socket.disconnect();
        } catch (e) {
          console.error(e);
        }
      }, 10000);
    } catch (e: any) {
      if (e.name === validationError) {
        // callback(e.msg);
      } else {
        console.error(e);
      }
      return;
    }
  };

  socket.on("createRoom", createRoom);
  socket.on("joinRoom", joinRoom);
  socket.on("startGame", startGame);
  socket.on("bid", bid);
  socket.on("sendMessage", sendMessage);

  socket.on("reconnect", reconnect);
  socket.on("disconnect", disconnect);
};
