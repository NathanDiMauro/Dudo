/** Class representing a player */
export class Player {
  id: string;
  playerName: string;
  dice: number[];
  disconnected: boolean = false;

  /**
   * Create a player
   * @param {String} id           The id of the socket for the player
   * @param {String} playerName   The name of the player
   */
  constructor(id: string, playerName: string) {
    this.id = id;
    this.playerName = playerName;
    this.disconnected = false;
    this.dice = [];
  }
}