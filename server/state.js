const { Player } = require('./player');
const { Room } = require('./room');


const rooms = [] // Array of Room class

/**
 * Creates a new room with roomCode of roomCode 
 * @param {String}      roomCode    Room code for new new room to create
 * @returns {Object}    error       An error (if there is one)
 */
const createRoom = (roomCode) => {
    if (rooms.find(room => room.roomCode === roomCode)) {
        return { error: 'Room already exists' };
    }
    rooms.push(new Room(roomCode));
    return {};
}

/**
 * Adds a plyer to the room with roomCode
 * @param {String} id           id of the socket of the new player
 * @param {String} name         name of the new player
 * @param {String} roomCode     roomCode of the room that the player is joining 
 * @returns {Object} error      An error (if there is one)
 * @returns {Object} newPlayer  The new player (if no error occurs)
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

// Get a player based on their id
/**
 * 
 * @param {String} id   id of the player
 * @returns {Player}    The player with the id of id
 */
const getPlayer = (id) => {
    // First we have to get the room
    const room = getRoom(id);
    if (room) {
        // Then we can get the player
        return room.getPlayer(id);
    }
}

// Remove a player based on their id
/**
 * 
 * @param {String} id           id of the player
 * @returns {Player, roomCode}  If the player exists, it will return that removed player and the roomCode of the room that the player was in
 */
const removePlayer = (id) => {
    // First we have to get the room
    const room = getRoom(id);
    if (room) {
        // Then we cna remove the player
        return { player: room.removePlayer(id), roomCode: room.roomCode }
    }
}

/**
 * Returns an array of players in the room
 * @param {String} roomCode     The room code of the room to get the players
 * @returns {Array<Player>}     An array of players
 */
const getPlayers = (roomCode) => {
    // Getting room that matches roomCode
    const room = rooms.find(room => room.roomCode === roomCode);
    if (room) {
        // Returning the array of players
        return room.getPlayersBrief();
    }
}

// 
/**
 * Returns the room based on playerId
 * @param {string} playerId     id of the player
 * @returns {Room}              The room that has the player with id of id
 */
const getRoom = (playerId) => rooms.find(r => r.getPlayer(playerId));

module.exports = { addPlayer, getPlayer, removePlayer, getPlayers, getRoom, createRoom }