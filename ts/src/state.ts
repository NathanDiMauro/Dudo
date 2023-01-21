import { Player, PlayerBrief } from "../../shared/types";
import { Room } from "./room";
import { validationError } from "./socket/error";

const rooms: Array<Room> = [];

/**
 * Creates a new room with roomCode of roomCode
 * @param {string}		roomCode	Room code for new new room to create
 * If there is an error, it will throw an error.
 */
export const createRoom = (roomCode: string) => {
  if (rooms.find((room) => room.roomCode === roomCode)) {
    throw validationError("Room already exists");
  }
  rooms.push(new Room(roomCode));
};

/**
 * Adds a plyer to the room with roomCode
 * @param {string} id           id of the socket of the new player
 * @param {string} name         name of the new player
 * @param {string} roomCode     roomCode of the room that the player is joining
 * @returns {Player} If there is an error, it will throw an error, else it will return the new player
 */
export const addPlayer = (
  id: string,
  name: string,
  roomCode: string
): Player => {
  // Validate the provided name and roomCode.
  if (!name && !roomCode) {
    throw validationError("Username and room are required");
  }
  if (!name) {
    throw validationError("Username is required");
  }
  if (!roomCode) {
    throw validationError("Room is required");
  }

  // Get the room associated with roomCode
  let room = rooms.find((room) => room.roomCode === roomCode);

  if (!room) {
    throw validationError("Room does not exist");
  }

  // Check if there is a player with the same name in the same room.
  const existingPlayer = rooms.find(
    (room) => room.roomCode === roomCode && room.playerExistsByName(name)
  );
  if (existingPlayer) {
    throw validationError("Username already exists");
  }

  // Create a new player.
  const newPlayer: Player = {
    id: id,
    playerName: name,
    dice: [],
    disconnected: false,
    diceCount: 0,
  };
  // Add newPlayer to the room.
  room.addPlayer(newPlayer);

  return newPlayer;
};

/**
 * Get a player based on their id
 * @param {string} id   id of the player
 * @returns {Player | undefined}    The player with the id of id, if no players exists, undefined
 */
export const getPlayer = (id: string): Player | undefined => {
  // First we have to get the room
  const room = getRoom(id);
  if (room) {
    // Then we can get the player
    return room.getPlayer(id);
  }
};

/**
 * Remove a player based on their id
 * @param {string} id           id of the player
 * @returns {{player: Player, roomCode: String} | undefined}  If the player exists, it will return that removed player and the roomCode of the room that the player was in, else undefined
 */
export const removePlayer = (
  id: string
): { player: Player; roomCode: string } | undefined => {
  // First we have to get the room
  const room = getRoom(id);
  if (room) {
    // Then we can remove the player
    return { player: room.removePlayer(id)!, roomCode: room.roomCode };
  }
};

/**
 * Returns an array of players in the room
 * @param {string} roomCode     The room code of the room to get the players
 * @returns {PlayerBrief[] | undefined}          An array of players in the room with roomCode of roomCode, if no room with roomCode of roomCode exists, then undefined
 */
export const getPlayers = (roomCode: string): PlayerBrief[] | undefined => {
  // Getting room that matches roomCode
  const room = rooms.find((room) => room.roomCode === roomCode);
  if (room) {
    // Returning the array of players
    return room.getPlayersBrief();
  }
};

/**
 * Returns the room based on playerId
 * @param {string} playerId     id of the player
 * @returns {Room | undefined}  The room that has the player with id of id, if no room ha a player with an id of playerId, then undefined
 */
export const getRoom = (playerId: string) =>
  rooms.find((r) => r.getPlayer(playerId));
