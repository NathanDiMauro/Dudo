const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  addPlayer,
  getPlayer,
  getPlayers,
  removePlayer,
  getRoom,
  createRoom,
} = require("./state");
const { defaultConfig: config } = require("../config/default");

const port = config["port"];
const host = config["host"];
const corsOrigin = config["corsOrigin"];
const methods = config["methods"];

const app = express();
const http = createServer();

const io = new Server(http, {
  cors: {
    origin: corsOrigin,
    methods: methods,
  },
});

/**
 * Adding a new player to the room with roomCode
 * This should only be called from the join or createRoom socket event
 * @param {Socket}      socket      The socket of the user to not send the notification to
 * @param {String}      name        The name of the player joining the room
 * @param {String}      roomCode    The room code of the room to add the player to
 * @param {Callback}    callback    The callback function from the socket.on function. This is used to alert the client of any errors
 */
const _addPlayer = (socket, name, roomCode, callback) => {
  const { newPlayer, error } = addPlayer(socket.id, name, roomCode);

  // If there is an error, return it to the client
  if (error) return callback(error);

  // Adding the new player to the room
  socket.join(roomCode);

  // Notifying the entire room, except the sender, that a new player joined
  _sendNotificationWithoutSender(
    {
      title: "Someone just joined",
      description: `${newPlayer.playerName} just entered the room`,
    },
    roomCode,
    socket
  );

  // Sending an updated list of players to the room
  _sendPlayers(roomCode);
  callback(null);
};

/**
 * Will notify all players that a round is starting, and provide each payer with their new hand
 * @param {String} room     The room object to start the round for
 */
const _startRound = (room) => {
  // Updating client with list of players
  _sendPlayers(room.roomCode);
  // Starting a new round
  room.players.forEach((player) => {
    // Letting each player know what dice they have
    io.to(player.id).emit("diceForRound", { dice: player.dice });
  });
  _notifyWhoseTurn(room);
};

/**
 * Let the players know whose turn it is
 * @param {Room} room   The room to let the players know whose turn it is
 */
const _notifyWhoseTurn = (room) => {
  io.in(room.roomCode).emit(
    "turn",
    room.getPlayer(room.whoseTurn()).playerName
  );
  _sendNotification(
    {
      title: `It is ${room.getPlayer(room.whoseTurn()).playerName}'s turn`,
      description: "",
    },
    room.roomCode
  );
};

/**
 * Sending a notification to everyone except the sender
 * This will usually only be called when someone leaves or joins a room
 * @param {{title: String, description: String}}    notification    The notification Object to to sent
 * @param {String}                                  roomCode        The room code of the room to sent the notification to
 * @param {Socket}                                  socket          The socket of the user to not send the notification to
 */
const _sendNotificationWithoutSender = (notification, roomCode, socket) => {
  socket.in(roomCode).emit("notification", notification);
};

/**
 * Sending a notification to everyone in the room
 * This will usually be called to alter the client about game events
 * EX: round starting, round ending...
 * @param {{title: String, description: String}}    notification    The notification Object to to sent
 * @param {String}                                  roomCode        The room code of the room to sent the notification to
 * @param {Socket}                                  socket          The socket of the user to not send the notification to
 */
const _sendNotification = (notification, roomCode) => {
  io.in(roomCode).emit("notification", notification);
};

/**
 * Sending a list of players to everyone in the room
 * @param {String} roomCode     The room code of the room to send the list of players to
 */
const _sendPlayers = (roomCode) => {
  io.in(roomCode).emit("players", getPlayers(roomCode));
};

/**
 * Listening for new connections
 * In this on event, we set all other events for this socket.
 * @param {Socket} socket   The socket of the client connecting
 */
io.on("connection", (socket) => {
  /**
   * Listening for a client requesting to create a new room
   * @param {String}  name        The name of the player creating the room
   * @param {String}  roomCode    The roomCode to assign to the new room
   */
  socket.on("createRoom", ({ name, roomCode }, callback) => {
    try {
      const { error } = createRoom(roomCode);
      if (error) return callback(error);
      _addPlayer(socket, name, roomCode, callback);
    } catch (e) {
      console.log(e);
    }
  });

  /**
   * Listening for a client requesting to join a room
   * @param {String}  name        The name of the player trying to join the room
   * @param {String}  roomCode    The roomCode of the room that the player is trying to join
   */
  socket.on("join", ({ name, roomCode }, callback) => {
    try {
      _addPlayer(socket, name, roomCode, callback);
    } catch (e) {
      callback({ error: e.toString() });
    }
  });

  /**
   * Listening for clients requesting to start a new round
   */
  socket.on("startGame", (callback) => {
    try {
      const room = getRoom(socket.id);
      if (room) {
        if (room.roundStarted) {
          return callback({ error: "Round is in progress." });
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

        _sendNotification(notif, room.roomCode);
        room.newRound();
        _startRound(room);
      }
    } catch (e) {
      console.log(e);
      // callback({ error: e.toString() });
    }
  });

  /**
   * Listening for when a client is requesting to make a new bid
   * @param {{playerId: Number, action: String, amount: Number, dice: Number}}    new_bid     The new bid
   */
  socket.on("bid", ({ newBid }, callback) => {
    try {
      const room = getRoom(socket.id);
      if (room) {
        const player = room.getPlayer(socket.id);
        if (player) {
          const { bid, error, endOfRound, dice, endOfGame } = room.bid(newBid);

          if (bid) {
            io.in(room.roomCode).emit("newBid", { bid });
            _sendNotification(room.bidToString(bid), room.roomCode);
            _notifyWhoseTurn(room);
          } else if (endOfRound) {
            io.in(room.roomCode).emit("endOfRound", { endOfRound, dice });
            _sendNotification(
              { title: "Round is over", description: endOfRound },
              room.roomCode
            );
          } else if (endOfGame) {
            io.in(room.roomCode).emit("endOfGame", { endOfRound, dice });
          } else if (error) {
            callback(error);
          } else {
            callback({ error: "An unexpected error occurred " });
          }
        } else {
          callback({ error: "Invalid Player id" });
        }
      }
      callback();
    } catch (e) {
      console.error(e);
      callback({ error: e });
    }
  });

  socket.on("sendMessage", ({ message }, callback) => {
    try {
      const room = getRoom(socket.id);
      if (room) {
        const player = room.getPlayer(socket.id);
        _sendNotification(
          { title: player.playerName, description: message },
          room.roomCode
        );
        callback();
      } else {
        callback({ error: "Invalid player id" });
      }
    } catch (e) {
      callback({ error: e });
    }
  });

  socket.on("reconnect", ({ socketId }, callback) => {
    try {
      const room = getRoom(socketId);
      if (room) {
        const player = room.getPlayer(socketId); // prev player object
        player.id = socket.id;
        player.disconnected = false;
        socket.join(room.roomCode);
        _sendPlayers(room.roomCode);
        _sendNotification(
          { title: `${player.playerName} reconnected`, description: "" },
          room.roomCode
        );
        callback({ name: player.playerName, roomCode: room.roomCode });
      } else {
        callback({ error: "Player already deleted" });
      }
    } catch (e) {
      callback({ error: e });
    }
  });

  socket.on("disconnect", () => {
    const room = getRoom(socket.id);
    if (room === null || room === undefined) {
      socket.disconnect();
      return;
    }
    const player = room.getPlayer(socket.id);
    if (player === null || player === undefined) {
      socket.disconnect();
      return;
    }

    player.disconnected = true;
    _sendNotification(
      {
        title: `${player.playerName} just disconnected`,
        description: "They have 10 seconds to reconnect",
      },
      room.roomCode
    );
    _sendPlayers(room.roomCode);

    setTimeout(() => {
      try {
        if (!player.disconnected) return;
        const removedPlayer = room.removePlayer(player.id);
        _sendNotification(
          {
            title: "Someone just left",
            description: `${removedPlayer.playerName} just left the room`,
          },
          room.roomCode
        );
        _sendPlayers(room.roomCode);
        socket.disconnect();
      } catch (e) {
        console.log(e);
      }
    }, 10000);
  });
});

app.get("/", (req, res) => {
  req.setEncoding("Server is running");
});

http.listen(port, host, () => {
  console.log(`Listening on port ${port}`);
});
