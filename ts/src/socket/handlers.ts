import type { Bid, Error as _error } from "../../../shared/types";
import { Socket } from "../index";
import {
  getRoom,
  createRoom as stateCreateRoom,
  getRoom as stateGetRoom,
} from "../state";
import { ValidationErrorName, validationError } from "./error";
import {
  addPlayer,
  notifyWhoseTurn,
  sendNotification,
  sendPlayers,
  startRound,
} from "./utils";

export const registerHandlers = (socket: Socket) => {
  // TODO generate this room code.
  const roomCode = "1234";

  const createRoom = (name: string, callback: (error: _error) => void) => {
    try {
      stateCreateRoom(name);
      addPlayer(socket, name, roomCode);
    } catch (e: any) {
      if (e.name === ValidationErrorName) {
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
  ) => {
    try {
      addPlayer(socket, name, roomCode);
    } catch (e: any) {
      if (e.name === ValidationErrorName) {
        callback(e.message);
      } else {
        console.error(e);
      }
      return;
    }
  };

  // TODO simplify this handler. Put most of the login in the Room class.
  const startGame = (callback: (error: _error) => void) => {
    try {
      const room = stateGetRoom(socket.id);
      if (room === undefined) {
        callback({ msg: "Room does not exist." });
        return;
      }

      if (room.roundStarted) {
        callback({ msg: "Round is in progress." });
        return;
      }

      // Letting players know the game is starting
      let notif = {
        title: "New Round is Starting",
        description: "A new round is starting",
      };
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
        callback(e.message);
      } else {
        console.error(e);
      }
      return;
    }
  };

  const bid = (bid: Bid, callback: (error: _error) => void) => {
    try {
      const room = getRoom(socket.id);
      if (room === undefined) {
        callback({ msg: "Room does not exist" });
        return;
      }
      const player = room.getPlayer(socket.id);
      if (player === undefined) {
        callback({ msg: "Unable to find player" });
        return;
      }

      const res = room.bid(bid);

      // Check if the bid ended the round.

      if (res.hasOwnProperty("players")) {
        // io.in(room.roomCode).emit("endOfRound", res.eor.msg, res.players);
        sendNotification(
          { title: "Round is over", description: "res.eor.msg" },
          room.roomCode
        );
        return;
      }

      if (res.hasOwnProperty("bid")) {
        // io.in(room.roomCode).emit("newBid", res.bid)
        // sendNotification(room.bidToNotification(res.bid), room.roomCode);
        notifyWhoseTurn(room);
        return;
      }

      // TODO add support for the end of game
      if (res.hasOwnProperty("endOfGame")) {
        return;
      }
    } catch (e: any) {
      if (e.name === ValidationErrorName) {
        callback(e.message);
      } else {
        console.error(e);
      }
      return;
    }
  };

  const sendMessage = (message: string, callback: (error: _error) => void) => {
    try {
      const room = getRoom(socket.id);
      if (room === undefined) {
        callback({ msg: "Unable to find room" });
        return;
      }
      const player = room.getPlayer(socket.id);
      if (player === undefined) {
        callback({ msg: "Unable to find player" });
        return;
      }
      sendNotification(
        { title: player.playerName, description: message },
        room.roomCode
      );
    } catch (e: any) {
      if (e.name === validationError) {
        callback(e.msg);
      } else {
        console.error(e);
      }
      return;
    }
  };

  const reconnect = (socketId: string, callback: (error: _error) => void) => {
    try {
      const room = getRoom(socketId);
      if (room === undefined) {
        callback({ msg: "Unable to find room" });
        return;
      }
      const player = room.getPlayer(socketId);
      if (player === undefined) {
        callback({ msg: "Unable to find player" });
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
      // TODO update this callback to reflect to js version.
    } catch (e: any) {
      if (e.name === validationError) {
        callback(e.msg);
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
