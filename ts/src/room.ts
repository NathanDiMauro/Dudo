import type {
  Bid,
  EndOfRound,
  Notification,
  Player,
  PlayerBrief,
} from "../../shared/types";
import { validationError } from "./socket/error";

export class Room {
  /** @type {['raise', 'aces', 'call', 'spot']} */
  static validBidActions = ["raise", "aces", "call", "spot"];
  players: Player[] = [];
  roomCode: string;
  prevBid: Bid | undefined = undefined;
  betsInRound: number = 0;
  playerWhoJustLost: Player | undefined = undefined;
  roundStarted: boolean = false;

  /**
   * Create a room
   * @param {String} roomCode Room code
   */
  constructor(roomCode: string) {
    this.roomCode = roomCode;
  }

  /**
   * Add a player to the room
   * @param {Player} player   The new Player
   */
  addPlayer(player: Player) {
    this.players.push(player);
  }

  /**
   * Get a plyer based on their id
   * @param {string} playerId     The id of the player
   * @returns {Player | undefined}            The player with id of playerId
   */
  getPlayer(playerId: string): Player | undefined {
    return this.players.find((p) => p.id === playerId);
  }

  /**
   * Checking if a plyer exists based on player name
   * @param {string} playerName   The name of the player
   * @returns {boolean}           True if the player exists, false if not
   */
  playerExistsByName(playerName: string): boolean {
    return this.players.find((p) => p.playerName === playerName) !== undefined;
  }

  /**
   * Checking if a plyer exists based on player id
   * @param {string} playerId The id of the player
   * @returns {boolean}       True if player exits, false if not
   */
  playerExistsById(playerId: string): boolean {
    return this.players.find((p) => p.id === playerId) !== undefined;
  }

  /**
   * Removing player based on id
   * @param {string} playerId         The id of the player
   * @returns {Player | undefined}    The removed player if they exits, else undefined
   */
  removePlayer(playerId: string): Player | undefined {
    const index = this.players.findIndex((p) => p.id === playerId);
    if (index !== -1) {
      return this.players.splice(index, 1)[0];
    }
  }

  /**
   * Get a list of all players not including their dice, but just the amount of their dice
   * @returns {PlayerBrief[]} An array of an object with a playerName and diceCount
   */
  getPlayersBrief(): PlayerBrief[] {
    return this.players.map(
      (player: Player): PlayerBrief => ({
        playerName: player.playerName,
        diceCount: player.dice.length,
      })
    );
  }

  /**
   * Get all players dice
   * This is to reveal all the dice at the end of each round
   * @returns {[{playerName: string, dice: number[]}]}    An Array of an object with playerName and an array if dice
   */
  getAllDice(): { playerName: string; dice: number[] }[] {
    return JSON.parse(
      JSON.stringify(
        this.players.map((player) => ({
          playerName: player.playerName,
          dice: player.dice,
        }))
      )
    );
  }

  /**
   * Get a count of all the remaining players (players with dice)
   * @returns {number}    A count of the remaining players
   */
  getRemainingPlayers(): number {
    return this.players.reduce(
      (prev, curr) => (curr.dice.length > 0 ? prev + 1 : prev),
      0
    );
  }

  /**
   * Get the last player left
   * @returns {Player | undefined}    The winning player
   */
  getWinner(): Player | undefined {
    if (this.getRemainingPlayers() > 1) return;
    return this.players.find((player) => player.dice.length > 0);
  }

  /**
   * Get the total amount if dice in play
   * @returns {number}    The amount of currently in the game
   */
  countOfDice(): number {
    return this.players.reduce((prev, curr) => prev + curr.dice.length, 0);
  }

  /**
   * Get the amount of a specific die in play
   * If it is not the first round, it will count 1s as well
   * @param {number} die  The die to get the count of
   * @returns {number}    The amount of dice that match die in the game
   */
  countOfSpecificDie(die: number): number {
    let validDice: (dice: number) => boolean;
    if (this.betsInRound == 1) {
      validDice = (dice) => dice == die;
    } else {
      validDice = (dice) => dice == die || dice == 1;
    }

    return this.players.reduce((game_total, player) => {
      return (
        game_total +
        player.dice.reduce((player_total, dice) => {
          if (validDice(dice)) return player_total + 1;
          else return player_total;
        }, 0)
      );
    }, 0);
  }

  /**
   * Generating dice for a player
   * @param {number} size The size of the players hand
   * @returns {number[]}  An array of random number in range of 1-6, with the size of size
   */
  generateDice(size: number): number[] {
    let dice = [];
    for (let i = 0; i <= size; i++) {
      dice[i] = Math.ceil(Math.random() * 6);
    }
    return dice;
  }

  /**
   * Generating dice for each player
   */
  populatePlayerDice(): void {
    this.players.forEach((player) => {
      player.dice = this.generateDice(player.dice.length - 1);
    });
  }

  /**
   * Start a new round
   * Generates new dice for each player
   * Sets the prevBid to null
   * Sets betsInRound to 0
   */
  newRound(): void {
    this.populatePlayerDice();
    this.prevBid = undefined;
    this.betsInRound = 0;
    this.roundStarted = true;
  }

  /**
   * Validating that the bid sent from the client is valid
   * Checking the playerId, action, amount, and dice
   * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The new bid object
   * If the bid passed is not valid, it will throw an error.
   */
  validateBid(bid: Bid): void {
    // Checking if the same player has bid 2 times in a row
    if (this.prevBid) {
      this.checkTurn(bid.playerId);
    }

    // Checking if player exists
    if (!this.playerExistsById(bid.playerId)) {
      throw validationError(`Player with id of ${bid.playerId} does not exist`);
    }

    // Checking if it is a valid bid action
    if (!Room.validBidActions.includes(bid.action)) {
      throw validationError(`Invalid bid action: ${bid.action}`);
    }

    // Checking if the amount if dice is actually in the game
    if (bid.amount && bid.amount > this.countOfDice()) {
      throw validationError(
        `There are only ${this.countOfDice()} dice left in the game. ${
          bid.amount
        } is too high`
      );
    }

    // Checking if the dice # if valid (1-6)
    if (bid.action === "raise" || bid.action === "aces") {
      if (bid.amount === undefined || bid.amount === null)
        throw validationError("Bid amount cannot be undefined on raises");
      if (bid.dice === undefined || bid.dice === null)
        throw validationError("Bid dice cannot be undefined on raises");
      if (1 > bid.dice || bid.dice > 7)
        throw validationError(
          `Dice must be 1, 2, 3, 4, 5 , or 6. Not ${bid.dice}`
        );
    }

    // Can only call spot in the first half of the game
    if (
      bid.action === "spot" &&
      Math.floor((this.players.length * 5) / 2) > this.countOfDice()
    ) {
      throw validationError("Cannot call spot in the second half of a game");
    }

    // Only ned to check aces if they are bidding aces or raising
    if (
      (bid.action === "raise" || bid.action === "aces") &&
      this.prevBid != undefined
    ) {
      // Checking for the aces rule
      this.checkAces(bid);
    }
  }

  /**
   * Check whose turn it is to bet, passing in the id of the player who is betting
   * @param {string} playerId     id of the player who is making a bet
   * If it is not the player with id of playerId's turn, then an error will be thrown.
   */
  checkTurn(playerId: string): void {
    // Getting the id of the player whose turn it is
    const nextPlayerId = this.whoseTurn();
    if (nextPlayerId !== playerId) {
      throw validationError(
        `It is not ${this.getPlayer(playerId)?.playerName}s turn`
      );
    }
  }

  /**
   * Check whose turn it is
   * @returns {string} the playerId of whose turn it is
   */
  whoseTurn(): string {
    if (this.playerWhoJustLost) {
      return this.playerWhoJustLost.id;
    }

    if (this.prevBid === undefined) {
      return this.players[0].id;
    }
    // Get the index of the player who last went.
    const indexOfLast = this.players.findIndex(
      (player) => player.id === this.prevBid!.playerId
    );

    // Check if we are end of the array.
    if (indexOfLast >= this.players.length - 1) {
      return this.players[0].id;
    }

    return this.players[indexOfLast + 1].id;
  }

  /**
   * Checking for aces rule
   * If the prev. bid was aces, then we have to make sure the new bid is valid
   * This function should be called before raises and aces
   * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object
   * If the new bid is not valid, it will throw an error.
   */
  checkAces(bid: Bid): void {
    if (
      this.prevBid === undefined ||
      this.prevBid.amount === undefined ||
      bid.amount === undefined
    ) {
      // Not sure if we should return an error here.
      return;
    }

    // Aces rule
    if (this.prevBid.dice == 1 && this.prevBid.action == "aces") {
      // If the new bid is not 1s (aces)
      if (bid.dice !== 1 && bid.amount < this.prevBid.amount * 2 + 1) {
        // Bid amount has to be >= this.prevBid.amount * 2 + 1
        // If the new bid amount is not valid
        throw validationError(
          `Since the last bid was ${this.prevBid.amount} ${
            this.prevBid.dice
          }s, the next bid must be at least ${
            this.prevBid.amount * 2 + 1
          } of any dice`
        );
      } else if (bid.amount <= this.prevBid.amount) {
        // New bid is 1s, but is not the correct amount
        throw validationError("Cannot bid same amount or less of ones");
      }
    }
  }

  /**
   * Bid action of raising
   * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object
   * @returns {Bid}   If the new bid is not valid, it will throw an error, else it returns the new bid
   */
  bidRaise(bid: Bid): Bid {
    if (
      bid.amount! > this.prevBid!.amount! ||
      bid.dice! > this.prevBid!.dice!
    ) {
      this.prevBid = {
        playerId: bid.playerId,
        action: bid.action,
        amount: bid.amount,
        dice: bid.dice,
      };
      this.betsInRound++;
      // Appending the player name to the return object
      return Object.assign(
        { playerName: this.getPlayer(bid.playerId)!.playerName },
        this.prevBid
      );
    }
    throw validationError("Raise must raise the amount of dice or the dice");
  }

  /**
   * Bid action of bidding aces
   * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object
   * @returns {Bid}   If the new bid is not valid, it will throw an error, else it returns the new bid
   */
  bidAces(bid: Bid): Bid {
    // check if bid is at least half of the last bid
    // ceil just rounds up the division to the next num\

    // We prob do not nee this check because validate bid takes care of this. Keeping it for now tho
    if (this.prevBid!.dice == 1 && bid.amount! <= this.prevBid!.amount!) {
      throw validationError("Cannot bid same amount or less of 1s");
    } else if (
      this.prevBid!.dice != 1 &&
      bid.amount! < Math.ceil(this.prevBid!.amount! / 2)
    ) {
      throw validationError(
        "Your bid needs to be at least half(rounded up) of the last bid"
      );
    }

    this.prevBid = {
      playerId: bid.playerId,
      action: bid.action,
      amount: bid.amount,
      dice: bid.dice,
    };
    this.betsInRound++;
    // Appending the playerName to the return object
    return Object.assign(
      { playerName: this.getPlayer(bid.playerId)!.playerName },
      this.prevBid
    );
  }

  /**
   * Bid action of calling the previous bid
   * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object
   * @returns {{endOfRound: String, dice: [{playerName: String, dice: [Number]}]}}   An endOfRound object that states who lost a dice and what the call was, and a dice array that contains all dice in the round
   */
  bidCall(bid: Bid): EndOfRound {
    const dieCount = this.countOfSpecificDie(this.prevBid!.dice!);
    const players = this.getAllDice();

    const prevBidPlayer = this.getPlayer(this.prevBid!.playerId);
    const bidPlayer = this.getPlayer(bid.playerId);

    let return_str = `${bidPlayer!.playerName} called ${
      this.getPlayer(prevBidPlayer!.id)!.playerName
    } on their bet of ${this.prevBid!.amount!} ${this.prevBid!.dice}s. `;

    // Player who called loses a dice
    if (dieCount >= this.prevBid!.amount!) {
      this.getPlayer(bid.playerId)!.dice.pop();
      return_str += `${bidPlayer!.playerName} loses a dice.`;
      this.playerWhoJustLost = bidPlayer;
    } else {
      // Player who got called (prevBid) loses a dice
      prevBidPlayer!.dice.pop();
      return_str += `${prevBidPlayer!.playerName} loses a dice.`;
      this.playerWhoJustLost = prevBidPlayer;
    }
    const winner = this.getWinner();
    if (winner) {
      return {
        msg: `${winner.playerName} has won the game.`,
        players: players,
      };
    }

    return { msg: return_str, players: players };
  }

  /**
   * Bid action of calling the previous bid
   * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object
   * @returns {EndOfRound}   An endOfRound object that states who lost a dice and what the spot call was,  and a dice array that contains all dice in the round
   */
  bidSpot(bid: Bid): EndOfRound {
    //player claims that the previous bidder's bid is exactly right
    //f the number is higher or lower, the claimant loses the round; otherwise,
    //the bidder loses the round.

    const players = this.getAllDice();

    const dieCount = this.countOfSpecificDie(this.prevBid!.dice!);

    const bidPlayer = this.getPlayer(bid.playerId);

    let return_str = `${bidPlayer!.playerName} called spot on ${
      this.prevBid!.amount
    } ${this.prevBid!.dice}s. ${bidPlayer!.playerName} `;

    if (dieCount === this.prevBid!.amount) {
      // If they do not have 5 dice in hand, ive them dice
      if (bidPlayer!.dice.length < 5) {
        bidPlayer!.dice.push(1);
        return_str += "called spot correctly and gets 1 dice back.";
      } else {
        return_str +=
          "called spot correctly, however, they already have 5 dice.";
      }
    } else {
      bidPlayer!.dice.pop();
      return_str += "called spot incorrectly and loses 1 dice.";
    }

    this.playerWhoJustLost = bidPlayer;

    return { msg: return_str, players: players };
  }

  /**
   * Handles all incoming bids
   * When a new bid needs to be made, this function should be called
   * @param {{playerId: String, action: String, amount: Number, dice: Number}} bid The bid object
   * @returns {bid: Bid | eor: EndOfRound}   If the new bid is not valid, it will throw an error.
   * If the new bid ends the round, it will return an EndOfROund object, else returns the new bid
   */
  bid(bid: Bid): { bid: Bid } | { eor: EndOfRound } {
    if (!this.roundStarted) {
      throw validationError("Game has not been started yet.");
    }
    this.validateBid(bid);
    // initial round bet
    if (this.prevBid == null) {
      if (bid.action === "call" || bid.action === "spot") {
        throw validationError(`Cannot call ${bid.action} on initial bet.`);
      }
      this.betsInRound++;
      this.playerWhoJustLost = undefined;
      this.prevBid = {
        playerId: bid.playerId,
        action: bid.action,
        amount: bid.amount,
        dice: bid.dice,
      };
      return {
        bid: Object.assign(
          { playerName: this.getPlayer(bid.playerId)!.playerName },
          this.prevBid
        ),
      };
    }

    switch (bid.action) {
      case "raise":
        return { bid: this.bidRaise(bid) };
      case "aces":
        return { bid: this.bidAces(bid) };
      case "call":
        this.roundStarted = false;
        return { eor: this.bidCall(bid) };
      case "spot":
        this.roundStarted = false;
        return { eor: this.bidSpot(bid) };
      default:
        throw validationError("Invalid bid action");
    }
  }

  /**
   * Formats a bid into a notification
   * @param {{playerId: String, playerName: String, action: String, amount: Number, dice: Number}}    bid The bid object
   * @returns {{title: String, description: String}}  The notification
   */
  bidToNotification(bid: Bid): Notification {
    return {
      title: "A new bid has been made",
      description: `${this.getPlayer(bid.playerId)!.playerName} bet ${
        bid.amount
      } ${bid.amount}s`,
    };
  }
}
