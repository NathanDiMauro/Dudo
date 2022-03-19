const { Player } = require('./player');

/** Class representing a room */
class Room {
    /** @type {['raise', 'aces', 'call', 'spot']} */
    static validBidActions = ['raise', 'aces', 'call', 'spot'];
    /** @member {[Player]} */
    players;
    /** @member {String} */
    roomCode;
    /** @member {{playerId: String, action: String, amount: Number, dice: Number} | null} */
    prevBid;
    /** @member {Number | null} */
    betsInRound;
    playerWhoJustLost;
    roundStarted;

    /**
     * Create a room
     * @param {String} roomCode Room code  
     */
    constructor(roomCode) {
        this.roomCode = roomCode;
        this.players = [];
        this.prevBid = null;
        this.betsInRound = null;
        this.playerWhoJustLost = null;
        this.roundStarted = false;
    }

    /**
     * Add a player to the room  
     * @param {Player} player   The new Player  
     */
    addPlayer(player) {
        this.players.push(player);
    }

    /**
     * Get a plyer based on their id  
     * @param {String} playerId     The id of the player  
     * @returns {Player}            The player with id of playerId  
     */
    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }

    /**
     * Checking if a plyer exists based on player name  
     * @param {String} playerName   The name of the player  
     * @returns {Boolean}           True if the player exists, false if not  
     */
    playerExistsByName(playerName) {
        return this.players.find(p => p.playerName === playerName) !== undefined;
    }

    /**
     * Checking if a plyer exists based on player id  
     * @param {String} playerId The id of the player   
     * @returns {Boolean}       True if player exits, false if not  
     */
    playerExistsById(playerId) {
        return this.players.find(p => p.id === playerId) !== undefined;
    }

    /**
     * Removing player based on id  
     * @param {String} playerId         The id of the player  
     * @returns {Player | undefined}    The removed player if they exits, else undefined  
     */
    removePlayer(playerId) {
        const index = this.players.findIndex((p) => p.id === playerId);
        if (index !== -1) {
            return this.players.splice(index, 1)[0];
        }
    }

    /**
     * Get a list of all players not including their dice, but just the amount of their dice  
     * @returns {[{playerName: String, diceCount: Number}]} An array of an object with a playerName and diceCount  
     */
    getPlayersBrief() {
        return this.players.map((player) => ({ playerName: player.playerName, diceCount: player.dice.length }));
    }

    /**
     * Get all players dice  
     * This is to reveal all the dice at the end of each round
     * @returns {[{playerName: String, dice: [Number]}]}    An Array of an object with playerName and an array if dice
     */
    getAllDice() {
        return JSON.parse(JSON.stringify(this.players.map((player) => ({ playerName: player.playerName, dice: player.dice }))));
    }

    /**
     * Get a count of all the remaining players (players with dice)
     * @returns {Number}    A count of the remaining players
     */
    getRemainingPlayers() {
        return this.players.reduce((prev, curr) => curr.dice.length > 0 ? prev + 1 : prev, 0);
    }

    /**
     * Get the last player left
     * @returns {Player}    The winning player
     */
    getWinner() {
        if (this.getRemainingPlayers() > 1) return;
        return this.players.find((player) => player.dice.length > 0);
    }

    /**
     * Get the total amount if dice in play  
     * @returns {Number}    The amount of currently in the game  
     */
    countOfDice() {
        return this.players.reduce((prev, curr) => prev + curr.dice.length, 0)
    }

    /**
     * Get the amount of a specific die in play  
     * If it is not the first round, it will count 1s as well  
     * @param {Number} die  The die to get the count of  
     * @returns {Number}    The amount of dice that match die in the game  
     */
    countOfSpecificDie(die) {
        let validDice;
        if (this.betsInRound == 1) {
            validDice = (dice) => dice == die;
        } else {
            validDice = (dice) => dice == die || dice == 1;
        }

        return this.players.reduce((game_total, player) => {
            return game_total + player.dice.reduce((player_total, dice) => {
                if (validDice(dice)) return player_total + 1;
                else return player_total;
            }, 0)
        }, 0);
    }

    /**
     * Generating dice for a player  
     * @param {Number} size The size of the players hand  
     * @returns {[Number]}  An array of random number in range of 1-6, with the size of size  
     */
    generateDice(size) {
        let dice = [];
        for (let i = 0; i <= size; i++) {
            dice[i] = Math.ceil(Math.random() * 6);
        }
        return dice;
    }

    /**
     * Generating dice for each player
     */
    populatePlayerDice() {
        this.players.forEach(player => {
            player.dice = this.generateDice(player.dice.length - 1)
        });
    }

    /**
     * Start a new round  
     * Generates new dice for each player  
     * Sets the prevBid to null  
     * Sets betsInRound to 0  
     */
    newRound() {
        this.populatePlayerDice();
        this.prevBid = null;
        this.betsInRound = 0;
        this.roundStarted = true;
    }

    /**
     * Validating that the bid sent from the client is valid  
     * Checking the playerId, action, amount, and dice  
     * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The new bid object
     * @returns {{error: String} | undefined}   If the bid passed is not valid, it returns an error, else undefined
     */
    validateBid(bid) {
        // Checking if the same player has bid 2 times in a row
        if (this.prevBid) {
            const { error } = this.checkTurn(bid.playerId) || {};
            if (error) return { error };
        }

        // Checking if player exists
        if (!this.playerExistsById(bid.playerId)) {
            return { error: `Player with id of ${bid.playerId} does not exist` };
        }

        // Checking if it is a valid bid action
        if (!Room.validBidActions.includes(bid.action)) {
            return { error: `Invalid bid action: ${bid.action}` };
        }

        // Checking if the amount if dice is actually in the game
        if (bid.amount > this.countOfDice()) {
            return { error: `There are only ${this.countOfDice()} dice left in the game. ${bid.amount} is too high` }
        }

        // Checking if the dice # if valid (1-6)
        if ((bid.action === 'raise' || bid.action === 'aces')) {
            if (bid.amount === undefined || bid.amount === null)
                return { error: 'Bid amount cannot be undefined on raises' }
            if (bid.dice === undefined || bid.dice === null)
                return { error: 'Bid dice cannot be undefined on raises' }
            if (1 > bid.dice || bid.dice > 7)
                return { error: `Dice must be 1, 2, 3, 4, 5 , or 6. Not ${bid.dice}` };
        }

        // Can only call spot in the first half of the game
        if (bid.action === 'spot' && Math.floor(this.players.length * 5 / 2) > this.countOfDice()) {
            return { error: 'Cannot call spot in the second half of a game' };
        }

        // Only ned to check aces if they are bidding aces or raising
        if ((bid.action === 'raise' || bid.action === 'aces') && this.prevBid != null) {
            // Checking for the aces rule
            const { error } = this.checkAces(bid) || {};
            if (error) return { error };
        }
    }

    /**
     * Check whose turn it is to bet, passing in the id of the player who is betting
     * @param {String} playerId     id of the player who is making a bet
     * @returns {error | undefined} If it is not the player with id of playerId's turn, then error, else undefined
     */
    checkTurn(playerId) {
        // Getting the id of the player whose turn it is
        const nextPlayerId = this.whoseTurn();
        if (nextPlayerId !== playerId) {
            return { error: `It is not ${this.getPlayer(playerId).playerName}s turn` }
        }
    }

    /**
     * Check whose turn it is
     * @returns {String} the playerId of whose turn it is
     */
    whoseTurn() {
        if (this.playerWhoJustLost) {
            return this.playerWhoJustLost
        }

        if (this.prevBid === null) {
            return this.players[0].id;
        }
        // Getting the index of the player who last went
        const indexOfLast = this.players.findIndex((player) => player.id === this.prevBid.playerId);
        // If were at the end of the array
        if (indexOfLast >= this.players.length - 1) {
            return this.players[0].id
        }
        return this.players[indexOfLast + 1].id;
    }

    /**
     * Checking for aces rule  
     * If the prev. bid was aces, then we have to make sure the new bid is valid  
     * This function should be called before raises and aces  
     * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object
     * @returns {{error: String} | undefined}   If the new bid is not valid, it returns an error, else undefined
     */
    checkAces(bid) {
        // Aces rule
        if (this.prevBid.dice == 1 && this.prevBid.action == 'aces') {
            // If the new bid is not 1s (aces)
            if (bid.dice !== 1 && bid.amount < this.prevBid.amount * 2 + 1) {
                // Bid amount has to be >= this.prevBid.amount * 2 + 1
                // If the new bid amount is not valid
                return { error: `Since the last bid was ${this.prevBid.amount} ${this.prevBid.dice}s, the next bid must be at least ${this.prevBid.amount * 2 + 1} of any dice` }
            } else if (bid.amount <= this.prevBid.amount) {
                // New bid is 1s, but is not the correct amount
                return { error: 'Cannot bid same amount or less of ones' };
            }
        }
    }

    /**
     * Bid action of raising  
     * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object 
     * @returns {{error: String} | bid: {playerId: String, action: String, amount: Number, dice: Number}}   If the new bid is not valid, it returns an error, else it returns the new bid
     */
    bidRaise(bid) {
        if (bid.amount > this.prevBid.amount || bid.dice > this.prevBid.dice) {
            this.prevBid = { playerId: bid.playerId, action: bid.action, amount: bid.amount, dice: bid.dice };
            this.betsInRound++;
            // Appending the player name to the return object
            return { bid: Object.assign({ playerName: this.getPlayer(bid.playerId).playerName }, this.prevBid) }
        }
        return { error: 'Raise must raise the amount of dice or the dice' };
    }

    /**
     * Bid action of bidding aces  
     * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object 
     * @returns {{error: String} | bid: {playerId: String, playerName: String, action: String, amount: Number, dice: Number}}   If the new bid is not valid, it returns an error, else it returns the new bid
     */
    bidAces(bid) {
        // check if bid is at least half of the last bid
        // ceil just rounds up the division to the next num\

        // We prob do not nee this check because validate bid takes care of this. Keeping it for now tho
        if (this.prevBid.dice == 1 && bid.amount <= this.prevBid.amount) {
            return { error: 'Cannot bid same amount or less of 1s' }
        } else if (this.prevBid.dice != 1 && bid.amount < Math.ceil(this.prevBid.amount / 2)) {
            return { error: 'Your bid needs to be at least half(rounded up) of the last bid' };
        }

        this.prevBid = { playerId: bid.playerId, action: bid.action, amount: bid.amount, dice: bid.dice }
        this.betsInRound++;
        // Appending the playerName to the return object
        return { bid: Object.assign({ playerName: this.getPlayer(bid.playerId).playerName }, this.prevBid) };
    }

    /**
     * Bid action of calling the previous bid  
     * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object 
     * @returns {{endOfRound: String, dice: [{playerName: String, dice: [Number]}]}}   An endOfRound object that states who lost a dice and what the call was, and a dice array that contains all dice in the round
     */
    bidCall(bid) {
        const dieCount = this.countOfSpecificDie(this.prevBid.dice);
        const dice = this.getAllDice();

        let return_str = `${this.getPlayer(bid.playerId).playerName} called ${this.getPlayer(this.prevBid.playerId).playerName} on their bet of ${this.prevBid.amount} ${this.prevBid.dice}s. `;

        // Player who called loses a dice
        if (dieCount >= this.prevBid.amount) {
            this.getPlayer(bid.playerId).dice.pop();
            return_str += `${this.getPlayer(bid.playerId).playerName} loses a dice.`;
            this.playerWhoJustLost = bid.playerId;
        } else {
            // Player who got called (prevBid) loses a dice
            this.getPlayer(this.prevBid.playerId).dice.pop();
            return_str += `${this.getPlayer(this.prevBid.playerId).playerName} loses a dice.`
            this.playerWhoJustLost = this.prevBid.playerId;
        }
        const winner = this.getWinner();
        if (winner) {
            return { endOfGame: `${winner.playerName} has won the game.`, dice: dice }
        }

        return { endOfRound: return_str, dice };
    }

    /**
     * Bid action of calling the previous bid  
     * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object 
     * @returns {{endOfRound: String,  dice: [{playerName: String, dice: [Number]}]}}   An endOfRound object that states who lost a dice and what the spot call was,  and a dice array that contains all dice in the round
     */
    bidSpot(bid) {
        //player claims that the previous bidder's bid is exactly right
        //f the number is higher or lower, the claimant loses the round; otherwise, 
        //the bidder loses the round.

        const dice = this.getAllDice()

        const dieCount = this.countOfSpecificDie(this.prevBid.dice);

        let return_str = `${this.getPlayer(bid.playerId).playerName} called spot on ${this.prevBid.amount} ${this.prevBid.dice}s. ${this.getPlayer(bid.playerId).playerName} `;

        if (dieCount === this.prevBid.amount) {
            // If they do not have 5 dice in hand, ive them dice
            if (this.getPlayer(bid.playerId).dice.length < 5) {
                this.getPlayer(bid.playerId).dice.push(1);
                return_str += 'called spot correctly and gets 1 dice back.';
            } else {
                return_str += 'called spot correctly, however, they already have 5 dice.';
            }
        } else {
            this.getPlayer(bid.playerId).dice.pop();
            return_str += 'called spot incorrectly and loses 1 dice.';
        }

        this.playerWhoJustLost = bid.playerId;

        return { endOfRound: return_str, dice: dice };
    }

    /**
     * Handles all incoming bids  
     * When a new bid needs to be made, this function should be called  
     * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object 
     * @returns {{error: String} | bid: {playerId: String, playerName: String, action: String, amount: Number, dice: Number}}   If the new bid is not valid, it returns an error, else it returns the new bid
     */
    bid(bid) {
        if (this.betsInRound == null) {
            return { error: 'Game has not been started yet.' };
        }
        const { error } = this.validateBid(bid) || {};
        if (error) {
            return { error };
        }
        // initial round bet
        if (this.prevBid == null) {
            if (bid.action === 'call' || bid.action === 'spot') {
                return { error: `Cannot call ${bid.action} on initial bet.` };
            }
            this.betsInRound++;
            this.playerWhoJustLost = null;
            this.prevBid = { playerId: bid.playerId, action: bid.action, amount: bid.amount, dice: bid.dice }
            return { bid: Object.assign({ playerName: this.getPlayer(bid.playerId).playerName }, this.prevBid) }
        }

        switch (bid.action) {
            case 'raise':
                return this.bidRaise(bid);
            case 'aces':
                return this.bidAces(bid);
            case 'call':
                this.roundStarted = false;
                return this.bidCall(bid);
            case 'spot':
                this.roundStarted = false;
                return this.bidSpot(bid);
            default:
                return { error: 'Invalid bid action' };
        }
    }

    /**
     * Formats a bid into a notification
     * @param {{playerId: String, playerName: String, action: String, amount: Number, dice: Number}}    bid The bid object
     * @returns {{title: String, description: String}}  The notification
     */
    bidToString(bid) {
        return { title: 'A new bid has been made', description: `${bid.playerName} bet ${bid.amount} ${bid.amount}s` };
    }
}
module.exports = { Room }