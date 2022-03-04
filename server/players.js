class Player {
    id;         // Number
    playerName; // String
    dice = [];   // Number
    diceCount; // amount of dice 

    constructor(id, playerName) {
        this.id = id;
        this.playerName = playerName;
        this.dice = [1, 1, 1, 1, 1];
        this.diceCount = 5;
    }
}

class Room {
    static validBidActions = ['raise', 'aces', 'call', 'spot'];
    players; // Array of Player class
    roomCode; // String
    prevBid = {
        playerId: null,
        action: null,
        amount: null, // amount of dice ie. (4) two's 4 being the amount
        dice: null // dice num 4 (two's) two's being the nice num
    };  // {playerID: Player, action: String, amount: Number, dice: Number}
    betsInRound;

    constructor(roomCode) {
        this.roomCode = roomCode;
        this.players = [];
        this.prevBid = null;
        this.betsInRound = null;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    // Get a plyer based on their id
    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }

    // Checking if a plyer exists based on player name
    playerExistsByName(playerName) {
        return this.players.find(p => p.playerName === playerName) !== undefined;
    }

    // Checking if a plyer exists based on player id
    playerExistsById(playerId) {
        return this.players.find(p => p.id === playerId) !== undefined;
    }

    // Removing player based on id
    removePlayer(playerId) {
        const index = this.players.findIndex((p) => p.id === playerId);
        if (index !== -1) {
            return this.players.splice(index, 1)[0];
        }
    }

    getPlayersBrief() {
        return this.players.map((player) => ({ playerName: player.playerName, diceCount: player.dice.length }))
    }

    // Utility function for getting the total amount if dice in play
    countOfDice() {
        return this.players.reduce((prev, curr) => prev + curr.dice.length, 0)
    }

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

    // Utility function for generating dice for a player
    generateDice(size) {
        let dice = [];
        for (let i = 0; i <= size-1; i++) {
            dice[i] = Math.ceil(Math.random() * 6);
        }
        return dice;
    }

    // Generating dice for each player
    populatePlayerDice() {
        this.players.forEach(player => {
            player.dice = this.generateDice(player.diceCount)
            player.dieCount = (player.dice).length
        });
    }

    newRound() {
        this.populatePlayerDice();
        this.prevBid = null;
        this.betsInRound = 0;
    }

    // Validating that the bid sent from the client is valid
    // Checking the playerId, action, amount, and dice
    validateBid(bid) {
        // Checking if the same player has bid 2 times in a row
        if (this.prevBid?.playerId == bid.playerId) {
            return { error: 'Player cannot bid 2 times in a row' };
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
        if (1 > bid.dice || bid.dice > 7) {
            return { error: `Dice must be 1, 2, 3, 4, 5 , or 6. Not ${bid.dice}` };
        }

        if ((bid.action == 'raise' || bid.action == 'aces') && this.prevBid != null) {
            // Checking for the aces rule
            const error = this.checkAces(bid);
            if (error) return { error };
        }
    }

    // Checking for aces rule
    // If the prev. bid was aces, then we have to make sure the new bid is valid
    // This function should be called before raises and aces
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

    bidRaise(bid) {
        if (bid.amount > this.prevBid.amount) {
            this.prevBid = { playerId: bid.playerId, action: bid.action, amount: bid.amount, dice: bid.dice }
            // this.prevBid = bid 
            // We could also do this I think?? I'm not sure
            // i think we can? - Liam
            this.betsInRound++;
            return { bid: this.prevBid }
        }
        if (bid.dice > this.prevBid.dice) {
            this.prevBid = { playerId: bid.playerId, action: bid.action, amount: bid.amount, dice: bid.dice }
            this.betsInRound++;
            return { bid: this.prevBid }
        }
        return { error: 'Raise must raise the amount of dice or the dice' };
    }

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
        return { bid: this.prevBid }
    }

    bidCall(bid) {
        const dieCount = this.countOfSpecificDie(this.prevBid.dice);

        let return_str = `${this.getPlayer(bid.playerId).playerName} called ${this.getPlayer(this.prevBid.playerId).playerName} on their bet of ${this.prevBid.amount} ${this.prevBid.dice}s.`;

        // Player who called loses a dice
        if (dieCount >= this.prevBid.amount) {
            this.getPlayer(bid.playerId).diceCount--;
            this.newRound();
            return {
                endOfRound: `${return_str} ${this.getPlayer(bid.playerId).playerName} loses a dice.`
            };
        } else {
            // Player who got called (prevBid) loses a dice
            this.getPlayer(this.prevBid.playerId).diceCount--;
            let prevPlayerName = this.getPlayer(this.prevBid.playerId).playerName;
            this.newRound();
            return {
                endOfRound: `${return_str} ${prevPlayerName} loses a dice.`
            };
        }
    }

    bidSpot(bid) {
        //player claims that the previous bidder's bid is exactly right
        //f the number is higher or lower, the claimant loses the round; otherwise, 
        //the bidder loses the round.
        const dieCount = this.countOfSpecificDie(this.prevBid.dice);

        let return_str = `${this.getPlayer(bid.playerId).playerName} called spot on ${this.prevBid.amount} ${this.prevBid.dice}s. ${this.getPlayer(bid.playerId).playerName}`;

        if (dieCount == this.prevBid.amount) {
            if (this.getPlayer(bid.playerId).dice.length < 5) {
                this.getPlayer(bid.playerId).diceCount++;
                this.newRound()
                return {
                    endOfRound: `${return_str} called spot correctly and gets 1 dice back.`
                }
            }
            this.newRound()
            return {
                endOfRound: `${return_str} called spot correctly, however, they already have 5 dice.`
            }
        } else {
            this.getPlayer(this.prevBid.playerId).diceCount--;
            this.newRound()
            return {
                endOfRound: `${return_str} called spot incorrectly and loses 1 dice.`
            }
        }
    }

    bid(bid) {
        const { error } = this.validateBid(bid) || {};
        if (error) {
            return { error };
        }
        // initial round bet
        if (this.prevBid == null) {
            if (bid.action == 'call' || bid.action == 'spot') {
                return { error: `Cannot call ${bid.action} on initial bet.` };
            }
            this.prevBid = { playerId: bid.playerId, action: bid.action, amount: bid.amount, dice: bid.dice }
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
                return { error: 'Invalid bid action' };
        }
    }
}
module.exports = { Player, Room }