/** Class representing a player */
class Player {
    id;         // Number
    playerName; // String
    dice = [];   // Number
    diceCount; // amount of dice 

    /**
     * Create a player
     * @param {String} id           The id of the socket for the player
     * @param {String} playerName   The name of the player
     */
    constructor(id, playerName) {
        this.id = id;
        this.playerName = playerName;
        this.dice = [1, 1, 1, 1, 1];
        this.diceCount = 5;
    }
}

module.exports = { Player };