class Player {
    id;         // Number
    playerName; // String
    dice = [];   // Number

    constructor(id, playerName) {
        this.id = id;
        this.playerName = playerName;
    }
}

class Room {
    players; // Array of Player class
    roomCode; // String
    prevBid = {
        player: null,
        action:null,
        amount: null, 
        dice: null
    };  // {player: Player, action: String, amount: Number, dice: Number}

    constructor(roomCode) {
        this.roomCode = roomCode;
        this.players = [];
        this.prevBid = null;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }

    playerExists(playerName) {
        return this.players.filter(p => p.name === playerName);
    }

    removePlayer(player) {
        const index = this.players.findIndex((p) => p.id === player.id);
        if (index !== -1) {
            return players.splice(index, 1)[0];
        }
    }
    generateDice() {
        dice = [];
        for(let i = 0; i <= 5; i++) {
            dice[i] = Math.floor(Math.random() * 7);
        }
        return dice;
    }
    populatePlayerDice(player) {
        this.players.forEach(player =>
            player.dice = this.generateDice()
        );
        console.log(players.dice);
    }

    bid(player, action, amount, dice) {
        switch (action) {
            case 'raise':
                break;
            case 'aces':
                break;
            case 'call':
                break;
            case 'spot':
                break;
            default:
                // error
                break;
        }
    }
}
const rooms = [] // Array of Room class


const addPlayer = (id, name, roomCode) => {
    if (!name && !roomCode) return { error: 'Username and room are required' }
    if (!name) return { error: 'Username is required' }
    if (!roomCode) return { error: 'Room is required' }

    let room = rooms.find(room => room.roomCode === roomCode);
    if (room) {
        // Checking if there is a player with the same name in the same room
        const existingPlayer = rooms.find(room => room.roomCode === room && room.playerExists(name));
        if (existingPlayer) return { error: 'Username already exists' }
    } else {
        room = new Room(roomCode);
        rooms.push(room)
    }

    const newPlayer = new Player(id, name);
    room.addPlayer(newPlayer);
    return { newPlayer };
}

const getPlayer = (id) => {
    const room = getRoom(id);
    if (room) {
        return room.getPlayer(id);
    }
}

const removePlayer = (id) => {
    const room = getRoom(id);
    if (room) {
        return room.removePlayer(id)
    }
}

// Returns the players in the room;
const getPlayers = (roomCode) => {
    const room = rooms.find(room => room.roomCode === roomCode);
    if (room) {
        return room.players;
    }
}

// Returns the room based on playerId
const getRoom = (playerId) => rooms.find(r => r.getPlayer(playerId));

module.exports = { addPlayer, getPlayer, removePlayer, getPlayers, getRoom }