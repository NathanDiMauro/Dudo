const { Player } = require('./room');
const { Room } = require('./player');


const rooms = [] // Array of Room class


const createRoom = (roomCode) => {
    if (rooms.find(room => room.roomCode === roomCode)) {
        return { error: 'Room already exists' };
    }
    rooms.push(new Room(roomCode));
    return {};
}

// Adds a plyer to the room with roomCode
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
const getPlayer = (id) => {
    // First we have to get the room
    const room = getRoom(id);
    if (room) {
        // Then we can get the player
        return room.getPlayer(id);
    }
}

// Remove a player based on their id
const removePlayer = (id) => {
    // First we have to get the room
    const room = getRoom(id);
    if (room) {
        // Then we cna remove the player
        return room.removePlayer(id)
    }
}

// Returns an array of players in the room;
const getPlayers = (roomCode) => {
    // Getting room that matches roomCode
    const room = rooms.find(room => room.roomCode === roomCode);
    if (room) {
        // Returning the array of players
        return room.getPlayersBrief();
    }
}

// Returns the room based on playerId
const getRoom = (playerId) => rooms.find(r => r.getPlayer(playerId));

module.exports = { addPlayer, getPlayer, removePlayer, getPlayers, getRoom, createRoom }