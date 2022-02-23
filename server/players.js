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
    static validBidActions = ['raise, aces, call, spot'];
    players; // Array of Player class
    roomCode; // String
    prevBid = {
        playerId: null,
        action: null,
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

    countOfDice() {
        return this.players.reduce((prev, curr) => prev + curr.dice.length, 0)
    }

    generateDice() {
        dice = [];
        for (let i = 0; i <= 5; i++) {
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

    validateBid(bid) {
        // Checking if player exists
        if (!this.playerExists(bid.playerId)) {
            return { error: `Player with id of ${bid.playerId} does not exist` };
        }
        // Checking if it is a valid bid action
        if (!Room.validBidActions.includes(bid.action)) {
            return { error: `Invalid bid action: ${bid.action}` };
        }
        // Checking if the amount if dice is actually in the game
        if (bid.amount > this.countOfDice()) {
            return { error: `There are only ${this.countOfDice()} left in the game. ${bid.amount} is too high` }
        }
        // Checking if the dice # if valid (1-6)
        if (0 > bid.dice || bid.dice > 7) {
            return { error: `Dice must be 1, 2, 3, 4, 5 , or 6. Not ${bid.dice}` };
        }
        // Aces rule
        if (this.prevBid.dice == 1) {
            // If the new bid is not 1s (aces)
            if (bid.dice !== 1 && bid.amount <= this.prevBid.amount * 2 + 1) {
                // Bid amount has to be >= this.prevBid.amount * 2 + 1
                // If the new bid amount is not valid
                return { error: `Since the last bid was ${this.prevBid.amount} ${this.prevBid.dice}s, the next bid must be ${this.prevBid.amount * 2 + 1} of any dice` }
            } else if (bid.amount <= this.prevBid.amount) {
                // New bid is 1s, but is not the correct amount
                return { error: 'Cannot bid same amount or less of ones' };
            }
        }

        return { bid };
    }


    bidRaise(bid) {
        if (bid.amount > this.prevBid.amount) {
            this.prevBid = { playerId: bid.player, action: bid.action, amount: bid.amount, dice: bid.dice }
            return { bid: this.prevBid }
        }
        if (bid.dice > this.prevBid.dice) {
            this.prevBid = { playerId: bid.player, action: bid.action, amount: bid.amount, dice: bid.dice }
            return { bid: this.prevBid }
        }
        return { error: 'Raise must raise the amount of dice or the dice' };
    }

    bidAces(bid) {

    }

    bidCall(bid) {

    }

    bidSpot(bid) {

    }


    bid(bid) {
        const { bid, error } = this.validateBid(bid);
        if (error) {
            return { error };
        }
        // initial round bet
        if (this.prevBid == null) {
            if (bid.action == 'call' || bid.action == 'spot') {
                return { error: 'Cannot call spot of call on initial bet' };
            }
            this.prevBid = { playerId: bid.player, action: bid.action, amount: bid.amount, dice: bid.dice }
            return { bid: this.prevBid }
        }

        switch (bid.action) {
            case 'raise':
                return this.bidRaise(bid);
            case 'aces':
                return this.bidAces(bid);
            case 'call':
                return this.bidCall(bid);
            case 'spot':
                return this.bidSpot(bid);
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