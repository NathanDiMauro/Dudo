import { Socket } from "socket.io";
import { Notification } from "../../../shared/types";
import { io } from "../index";
import { Room } from "../room";
import { getPlayers, addPlayer as stateAddPlayer } from "../state";
import { validationError } from "./error";

/**
 * Add a new player to the room with roomCode
 * This should only be called from the join or createRoom socket event
 * @param {Socket}      socket      The socket of the user to not send the notification to
 * @param {String}      name        The name of the player joining the room
 * @param {String}      roomCode    The room code of the room to add the player to
 */
export const addPlayer = (socket: Socket, name: string, roomCode: string) => {
  const newPlayer = stateAddPlayer(socket.id, name, roomCode);

  // Add the new player to the room.
  socket.join(roomCode);

  // Notify the entire room, except the sender, that a new play has joined.
  sendNotificationWithoutSender(socket, roomCode, {
    title: "Someone just joined",
    description: `${newPlayer.playerName} just entered the room`,
  });

  sendPlayers(roomCode);
};

/**
 * Send a notification to everyone except the sender
 * This will usually only be called when someone leaves or joins a room
 * @param {Socket}                                  socket          The socket of the user to not send the notification to
 * @param {String}                                  roomCode        The room code of the room to sent the notification to
 * @param {{title: String, description: String}}    notification    The notification Object to to sent
 */
export const sendNotificationWithoutSender = (
  socket: Socket,
  roomCode: string,
  notification: Notification
) => {
  socket.in(roomCode).emit("notification", notification);
};

/**
 * Sending a notification to everyone in the room
 * This will usually be called to alter the client about game events
 * EX: round starting, round ending...
 * @param {Notification}    notification    The notification Object to to sent
 * @param {string}			roomCode        The room code of the room to sent the notification to
 */
export const sendNotification = (
  notification: Notification,
  roomCode: string
) => {
  io.in(roomCode).emit("notification", notification);
};

/**
 * Will notify all players that a round is starting, and provide each payer with their new hand
 * @param {Room} room     The room object to start the round for
 */
export const startRound = (room: Room) => {
  // Updating client with list of players
  sendPlayers(room.roomCode);
  // Starting a new round
  room.players.forEach((player) => {
    // Letting each player know what dice they have
    io.to(player.id).emit("diceForRound", player.dice);
  });
  notifyWhoseTurn(room);
};

/**
 * Let the players know whose turn it is
 * @param {Room} room   The room to let the players know whose turn it is
 */
export const notifyWhoseTurn = (room: Room) => {
  const player = room.getPlayer(room.whoseTurn());
  if (player === undefined) {
    // TODO this probably shouldn't be a validation error
    throw validationError("Unable to find player.");
  }

  io.in(room.roomCode).emit("turn", player.playerName);
  sendNotification(
    { title: `It is ${player.playerName}'s turn`, description: "" },
    room.roomCode
  );
};

/**
 * Send a list of players to everyone in the room
 * @param {String} roomCode     The room code of the room to send the list of players to
 */
export const sendPlayers = (roomCode: string) => {
  const players = getPlayers(roomCode);
  if (players) {
    io.in(roomCode).emit("players", players);
  }
};
