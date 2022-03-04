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

module.exports(Player);