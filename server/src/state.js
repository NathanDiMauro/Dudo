const { Player } = require('./player');
const { Room } = require('./room');


const rooms = [] // Array of Room class

/**
 * Creates a new room with roomCode of roomCode 
 * @param {String}      roomCode                Room code for new new room to create
 * @param {Function}    timerCallback           Callback function for the room's timer
 * @param {Number}      bidTime                 Time for each bid in the game
 * @returns {{error: String} | undefined}       If there is an error, it will return an error, else undefined
 */
const createRoom = (roomCode, timerCallback, bidTime) => {
    if (rooms.find(room => room.roomCode === roomCode)) {
        return { error: 'Room already exists' };
    }
    rooms.push(new Room(roomCode, timerCallback, bidTime));
    return {};
}

/**
 * Adds a plyer to the room with roomCode
 * @param {String} id           id of the socket of the new player
 * @param {String} name         name of the new player
 * @param {String} roomCode     roomCode of the room that the player is joining 
 * @returns {{error: String} | {newPlayer: Player}} If there is an error, it will return an error, else it will return the new player
 */
const addPlayer = (id, name, roomCode) => {
    // Validating the name and roomCode were provided
    if (!name && !roomCode) return { error: 'Username and room are required' }
    if (!name) return { error: 'Username is required' }
    if (!roomCode) return { error: 'Room is required' }

    // Getting the room associated with roomCode
    let room = rooms.find(room => room.roomCode === roomCode);

    if (!room) {
        return { error: 'Room does not exist' };
    }

    // Checking if there is a player with the same name in the same room
    const existingPlayer = rooms.find(room => room.roomCode === roomCode && room.playerExistsByName(name));
    if (existingPlayer) return { error: 'Username already exists' }

    // Creating new player
    const newPlayer = new Player(id, name);
    // Adding newPlayer to the room
    room.addPlayer(newPlayer);

    return { newPlayer };
}

/**
 * Get a player based on their id
 * @param {String} id   id of the player
 * @returns {Player | undefined}    The player with the id of id, if no players exists, undefined
 */
const getPlayer = (id) => {
    // First we have to get the room
    const room = getRoom(id);
    if (room) {
        // Then we can get the player
        return room.getPlayer(id);
    }
}

/**
 * Remove a player based on their id
 * @param {String} id           id of the player
 * @returns {{player: Player, roomCode: String} | undefined}  If the player exists, it will return that removed player and the roomCode of the room that the player was in, else undefined
 */
const removePlayer = (id) => {
    // First we have to get the room
    const room = getRoom(id);
    if (room) {
        // Then we can remove the player
        return { player: room.removePlayer(id), roomCode: room.roomCode }
    }
}

/**
 * Returns an array of players in the room
 * @param {String} roomCode     The room code of the room to get the players
 * @returns {[{playerName: String, diceCount: Number}] | undefined}          An array of players in the room with roomCode of roomCode, if no room with roomCode of roomCode exists, then undefined
 */
const getPlayers = (roomCode) => {
    // Getting room that matches roomCode
    const room = rooms.find(room => room.roomCode === roomCode);
    if (room) {
        // Returning the array of players
        return room.getPlayersBrief();
    }
}

/**
 * Returns the room based on playerId
 * @param {String} playerId     id of the player
 * @returns {Room | undefined}  The room that has the player with id of id, if no room ha a player with an id of playerId, then undefined
 */
const getRoom = (playerId) => rooms.find(r => r.getPlayer(playerId));

/**
 * Returns the time left on the timer for a room
 * @param {String} roomCode
 * @returns {Number}
 */
const getTimeLeft = (roomCode) => {
    const room = rooms.find(r => r.roomCode === roomCode);
    if (room) {
        // Not sure if I want to be calling `room.timer` here.
        // It might be a better idea to add timer methods to room.
        return room.timer.getTimeLeft();
    }
};

module.exports = { addPlayer, getPlayer, removePlayer, getPlayers, getRoom, createRoom, getTimeLeft }