import { Socket } from "socket.io";
import { Notification } from "../../../shared/types";
import { io } from "../index";
import { getPlayers, addPlayer as stateAddPlayer } from "../state";

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
const sendNotificationWithoutSender = (
  socket: Socket,
  roomCode: string,
  notification: Notification
) => {
  socket.in(roomCode).emit("notification", notification);
};

/**
 * Send a list of players to everyone in the room
 * @param {String} roomCode     The room code of the room to send the list of players to
 */
const sendPlayers = (roomCode: string) => {
  const players = getPlayers(roomCode);
  if (players) {
    io.in(roomCode).emit("players", players);
  }
};
