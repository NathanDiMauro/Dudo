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
    };  // {player: Player, action: String, amount: Number, dice: Number}

    constructor(roomCode) {
        this.roomCode = roomCode;
        this.players = [];
        this.prevBid = null;
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

    // Utility function for getting the total amount if dice in play
    countOfDice() {
        return this.players.reduce((prev, curr) => prev + curr.dice.length, 0)
    }

    // Utility function for generating dice for a player
    generateDice(size) {
        let dice = [];
        for (let i = 0; i <= size; i++) {
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

    // Validating that the bid sent from the client is valid
    // Checking the playerId, action, amount, and dice
    validateBid(bid) {
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
        // Checking for aces rule
        const { error } = this.checkAces();
        if (error) {
            return { error }
        }
        if (bid.amount > this.prevBid.amount) {
            this.prevBid = { playerId: bid.player, action: bid.action, amount: bid.amount, dice: bid.dice }
            // this.prevBid = bid 
            // We could also do this I think?? I'm not sure
            // i think we can? - Liam
            return { bid: this.prevBid }
        }
        if (bid.dice > this.prevBid.dice) {
            this.prevBid = { playerId: bid.player, action: bid.action, amount: bid.amount, dice: bid.dice }
            return { bid: this.prevBid }
        }
        return { error: 'Raise must raise the amount of dice or the dice' };
    }
    // IF YOU HAVE TIME CAN YOU Take a look through these
    bidAces(bid) {
        const { error } = this.checkAces();
        if (error) {
            return { error }
        }
        // check if bid is at least half of the last bid
        // ceil just rounds up the division to the next num
        if (bid.amount >= (Math.ceil(this.prevBid / 2))) {
            return { error: 'Your bid needs to be at least half(rounded up) of the last bid' };
        } else {
            this.prevBid = { playerId: bid.player, action: bid.action, amount: bid.amount, dice: bid.dice }
            // this.prevBid = bid
            return { bid: this.prevBid }
        }
    }

    bidCall(bid) {
        // person thinks last bid is fake (this is just so I remember what needed to be made)
        // getting all the dice 
        const { error } = this.checkAces();
        if (error) {
            return { error }
        }
        dieCount = 0;
        this.players.forEach(player =>
            player.dice.forEach(die => {
                if (die == this.prevBid.dice || die == 1) {
                    dieCount++;
                }
            })
        );
        //if the guess is not correct, the previous player (the player who made the bid) loses a die.
        if (dieCount <= this.prevBid.amount) {
            getPlayer(bid.playerId).diceCount--;
            return bid;
        } else {
            getPlayer(this.prevBid.playerId).diceCount--;
            return bid;
        }
        // these returns will probably need to return a value instead of text 
    }

    bidSpot(bid) {
        //player claims that the previous bidder's bid is exactly right
        //f the number is higher or lower, the claimant loses the round; otherwise, 
        //the bidder loses the round.
        dieCount = 0;
        this.players.forEach(player =>
            player.dice.forEach(die => {
                if (die == this.prevBid.dice || die == 1) {
                    dieCount++;
                }
            })
        );
        if (dieCount == this.prevBid.amount) {
            getPlayer(bid.playerId).diceCount--;
            return bid;
        } else {
            getPlayer(this.prevBid.playerId).diceCount--;
            return bid;
        }
    }

    bid(bid) {
        const { error } = this.validateBid(bid);
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
                return { error: 'Invalid bid action' };
        }
    }
}
module.exports = { Player, Room }