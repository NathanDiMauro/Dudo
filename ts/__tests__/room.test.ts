import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import type { Player } from "../../shared/types";
import { Room } from "../src/room";
import { validationError } from "../src/socket/error";

let room: Room;
const emptyPlayer: Player = {
  id: "",
  playerName: "",
  disconnected: false,
  dice: [],
  diceCount: 0,
};
let player1: Player;
let player2: Player;
let player3: Player;

beforeEach(() => {
  room = new Room("1234");
  player1 = {
    id: "0",
    playerName: "name",
    disconnected: false,
    dice: [],
    diceCount: 0,
  };
  player2 = {
    id: "1",
    playerName: "name2",
    disconnected: false,
    dice: [],
    diceCount: 0,
  };
});

afterEach(() => {
  room = new Room("");
  player1 = emptyPlayer;
  player2 = emptyPlayer;
  player3 = emptyPlayer;
});

describe("adding player", () => {
  test("add player", () => {
    room.addPlayer(player1);
    expect(room.players.length).toBe(1);
  });
});

describe("remove player", () => {
  test("remove player testing count", () => {
    room.addPlayer(player1);
    room.removePlayer("0");
    expect(room.players.length).toBe(0);
  });

  test("remove player testing return", () => {
    room.addPlayer(player1);
    expect(room.removePlayer("0")).toBe(player1);
  });

  test("remove player with invalid id", () => {
    expect(room.removePlayer("0")).toBe(undefined);
  });
});

describe("get player", () => {
  test("get player", () => {
    const newPlayer = player1;
    room.addPlayer(newPlayer);
    expect(room.getPlayer("0")).toBe(newPlayer);
  });

  test("get player with invalid id", () => {
    expect(room.getPlayer("0")).toBe(undefined);
  });
});

describe("get players brief", () => {
  test("get players brief", () => {
    player1.dice = [1, 2, 3, 4, 5];
    player2.dice = [1, 3, 4];

    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getPlayersBrief()).toStrictEqual([
      { playerName: player1.playerName, diceCount: 5 },
      { playerName: player2.playerName, diceCount: 3 },
    ]);
  });
});

describe("get all dice", () => {
  test("get all dice", () => {
    player1.dice = [1, 1, 1, 1, 1];
    player2.dice = [2, 2, 2, 2, 2];
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getAllDice()).toStrictEqual([
      { playerName: player1.playerName, dice: player1.dice },
      { playerName: player2.playerName, dice: player2.dice },
    ]);
  });
});

describe("get remaining players", () => {
  test("get reaming players - 0", () => {
    expect(room.getRemainingPlayers()).toBe(0);
  });

  test("get reaming players - 1", () => {
    player1.dice = [1, 2, 3, 4, 5];
    room.addPlayer(player1);
    expect(room.getRemainingPlayers()).toBe(1);
  });

  test("get reaming players - 2", () => {
    player1.dice = [1, 2, 3, 4, 5];
    player2.dice = [1, 2, 3, 4, 5];

    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getRemainingPlayers()).toBe(2);
  });

  test("get reaming players - 4", () => {
    player3 = {
      id: "3",
      playerName: "name2",
      disconnected: false,
      dice: [1, 2, 3, 4, 5],
      diceCount: 0,
    };
    let player4 = {
      id: "4",
      playerName: "name2",
      disconnected: false,
      dice: [1, 2, 3, 4, 5],
      diceCount: 0,
    };
    player1.dice = [1, 2, 3, 4, 5];
    player2.dice = [1, 2, 3, 4, 5];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.addPlayer(player3);
    room.addPlayer(player4);
    expect(room.getRemainingPlayers()).toBe(4);
  });

  test("get reaming players with 1 player out of dice", () => {
    player3 = {
      id: "3",
      playerName: "name3",
      disconnected: false,
      dice: [],
      diceCount: 0,
    };
    player1.dice = [1, 2, 3, 4, 5];
    player2.dice = [1, 2, 3, 4, 5];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.addPlayer(player3);
    player3.dice = [];
    expect(room.getRemainingPlayers()).toBe(2);
  });

  test("get reaming players with 2 player out of dice", () => {
    player3 = {
      id: "3",
      playerName: "name3",
      disconnected: false,
      dice: [],
      diceCount: 0,
    };
    let player4 = {
      id: "4",
      playerName: "name4",
      disconnected: false,
      dice: [],
      diceCount: 0,
    };
    player1.dice = [1, 2, 3, 4, 5];
    player2.dice = [1, 2, 3, 4, 5];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.addPlayer(player3);
    room.addPlayer(player4);
    expect(room.getRemainingPlayers()).toBe(2);
  });
});

describe("get winner", () => {
  test("get winner", () => {
    player1.dice = [1, 2, 3, 4, 5];
    room.addPlayer(player1);
    expect(room.getWinner()).toBe(player1);
  });

  test("get winner - 2 players left", () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getWinner()).toBe(undefined);
  });
});

describe("player exists", () => {
  test("player exists by name", () => {
    room.addPlayer(player1);
    expect(room.playerExistsByName("name")).toBeTruthy();
  });

  test("player exists by name with invalid name", () => {
    expect(room.playerExistsByName("name")).toBeFalsy();
  });

  test("player exists by id", () => {
    room.addPlayer(player1);
    expect(room.playerExistsById("0")).toBeTruthy();
  });

  test("player exists by id with invalid id", () => {
    expect(room.playerExistsById("0")).toBeFalsy();
  });
});

describe("count of dice", () => {
  test("count of dice in room", () => {
    player1.dice = [1, 2, 3, 4, 5];
    player2.dice = [1, 2, 3, 4, 5];
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.countOfDice()).toBe(10);
  });
});

describe("count of specific die", () => {
  beforeEach(() => {
    player1.dice = [2, 3, 2, 4, 1];
    player2.dice = [6, 4, 2, 1, 1];
    room.addPlayer(player1);
    room.addPlayer(player2);
  });

  test("count of dice on first bet", () => {
    room.betsInRound = 1;
    expect(room.countOfSpecificDie(2)).toBe(3);
  });

  test("count of dice on second bet", () => {
    room.betsInRound = 2;
    expect(room.countOfSpecificDie(2)).toBe(6);
  });
});

describe("populate dice", () => {
  test("populate player dice", () => {
    room.addPlayer(player1);
    player1.dice = [-1, -1, -1, -1, -1];
    room.populatePlayerDice();
    expect(player1.dice).not.toBe([-1, -1, -1, -1, -1]);
    expect(player1.dice[0]).toBeGreaterThan(0);
    expect(player1.dice[0]).toBeLessThan(7);
  });
});

describe("validate bid", () => {
  beforeEach(() => {
    player1.dice = [1, 2, 3, 4, 5];
    room.addPlayer(player1);
  });

  test("validate bid", () => {
    const bid = { playerId: player1.id, action: "raise", amount: 4, dice: 4 };
    expect(room.validateBid(bid)).toBe(undefined);
  });

  describe("amount", () => {
    test("validate bid with valid amount", () => {
      const bid = { playerId: player1.id, action: "call", amount: 2, dice: 4 };
      expect(room.validateBid(bid)).toBe(undefined);
    });

    test("validate bid with amount too high", () => {
      const bid = { playerId: player1.id, action: "call", amount: 6, dice: 4 };
      expect(() => room.validateBid(bid)).toThrow(
        validationError("There are only 5 dice left in the game. 6 is too high")
      );
    });

    test("validate bid with null amount", () => {
      const bid = {
        playerId: player1.id,
        action: "raise",
        amount: undefined,
        dice: 4,
      };
      expect(() => room.validateBid(bid)).toThrow(
        validationError("Bid amount cannot be undefined on raises")
      );
    });
  });

  describe("dice", () => {
    test("validate bid with invalid dice - negative", () => {
      const bid = {
        playerId: player1.id,
        action: "raise",
        amount: 4,
        dice: -1,
      };
      expect(() => room.validateBid(bid)).toThrow(
        validationError("Dice must be 1, 2, 3, 4, 5 , or 6. Not -1")
      );
    });

    test("validate bid with invalid dice - zero", () => {
      const bid = { playerId: player1.id, action: "raise", amount: 4, dice: 0 };
      expect(() => room.validateBid(bid)).toThrow(
        validationError("Dice must be 1, 2, 3, 4, 5 , or 6. Not 0")
      );
    });

    test("validate bid with invalid dice - positive", () => {
      const bid = {
        playerId: player1.id,
        action: "raise",
        amount: 4,
        dice: 10,
      };
      expect(() => room.validateBid(bid)).toThrow(
        validationError("Dice must be 1, 2, 3, 4, 5 , or 6. Not 10")
      );
    });
  });

  test("validate bid with player going 2 times in a row", () => {
    room.addPlayer(player2);
    const bid = { playerId: player1.id, action: "call", amount: 4, dice: 4 };
    room.prevBid = bid;
    expect(() => room.validateBid(bid)).toThrow(
      validationError(`It is not ${player1.playerName}s turn`)
    );
  });

  test("validate bid with invalid playerId", () => {
    const bid = { playerId: "2", action: "call", amount: 4, dice: 4 };
    expect(() => room.validateBid(bid)).toThrow(
      validationError("Player with id of 2 does not exist")
    );
  });

  test("validate bid with invalid bid action", () => {
    const bid = { playerId: player1.id, action: "invalid", amount: 4, dice: 4 };
    expect(() => room.validateBid(bid)).toThrow(
      validationError("Invalid bid action: invalid")
    );
  });
});

describe("check aces", () => {
  beforeEach(() => {
    room.addPlayer(player1);
  });

  test("check aces - valid", () => {
    const bid = { playerId: player1.id, action: "aces", amount: 3, dice: 1 };
    room.prevBid = { playerId: player1.id, action: "aces", amount: 1, dice: 1 };
    expect(room.checkAces(bid)).toBe(undefined);
  });

  test("check aces - bid reg too low", () => {
    const bid = { playerId: player1.id, action: "aces", amount: 2, dice: 2 };
    room.prevBid = { playerId: player1.id, action: "aces", amount: 1, dice: 1 };
    expect(() => room.checkAces(bid)).toThrow(
      validationError(
        "Since the last bid was 1 1s, the next bid must be at least 3 of any dice"
      )
    );
  });

  test("check aces - bid aces too low", () => {
    const bid = { playerId: player1.id, action: "aces", amount: 1, dice: 1 };
    room.prevBid = { playerId: player1.id, action: "aces", amount: 1, dice: 1 };
    expect(() => room.checkAces(bid)).toThrow(
      validationError("Cannot bid same amount or less of ones")
    );
  });
});

describe("bid raise", () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = {
      playerId: player1.id,
      action: "raise",
      amount: 3,
      dice: 3,
    };
  });

  test("bid raise - higher amount - valid", () => {
    const new_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 4,
      dice: 3,
    };
    const new_bid_result = {
      playerId: player2.id,
      playerName: player2.playerName,
      action: "raise",
      amount: 4,
      dice: 3,
    };
    expect(room.bidRaise(new_bid)).toStrictEqual(new_bid_result);
  });

  test("bid raise - higher dice - valid", () => {
    const new_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 3,
      dice: 4,
    };
    const new_bid_result = {
      playerId: player2.id,
      playerName: player2.playerName,
      action: "raise",
      amount: 3,
      dice: 4,
    };
    expect(room.bidRaise(new_bid)).toStrictEqual(new_bid_result);
  });

  test("bid raises - same amount and same dice - invalid", () => {
    const new_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 3,
      dice: 3,
    };
    expect(() => room.bidRaise(new_bid)).toThrow(
      validationError("Raise must raise the amount of dice or the dice")
    );
  });

  test("bid raise - lower amount same dice - invalid", () => {
    const new_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 2,
      dice: 3,
    };
    expect(() => room.bidRaise(new_bid)).toThrow(
      validationError("Raise must raise the amount of dice or the dice")
    );
  });

  test("bid raise - same amount lower dice - invalid", () => {
    const new_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 2,
      dice: 3,
    };
    expect(() => room.bidRaise(new_bid)).toThrow(
      validationError("Raise must raise the amount of dice or the dice")
    );
  });
});

describe("bid aces", () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
  });

  test("bid aces", () => {
    room.prevBid = {
      playerId: player1.id,
      action: "raise",
      amount: 8,
      dice: 2,
    };
    const new_bid = {
      playerId: player2.id,
      action: "aces",
      amount: 4,
      dice: 1,
    };
    const new_bid_result = {
      playerId: player2.id,
      playerName: player2.playerName,
      action: "aces",
      amount: 4,
      dice: 1,
    };
    expect(room.bidAces(new_bid)).toStrictEqual(new_bid_result);
  });

  test("bid aces with previous bid being aces", () => {
    room.prevBid = {
      playerId: player1.id,
      action: "raise",
      amount: 3,
      dice: 1,
    };
    const new_bid = {
      playerId: player2.id,
      action: "aces",
      amount: 4,
      dice: 1,
    };
    const new_bid_result = {
      playerId: player2.id,
      playerName: player2.playerName,
      action: "aces",
      amount: 4,
      dice: 1,
    };
    expect(room.bidAces(new_bid)).toStrictEqual(new_bid_result);
  });

  test("bid aces too low", () => {
    room.prevBid = {
      playerId: player1.id,
      action: "raise",
      amount: 8,
      dice: 2,
    };
    const new_bid = {
      playerId: player2.id,
      action: "aces",
      amount: 3,
      dice: 1,
    };
    expect(() => room.bidAces(new_bid)).toThrow(
      validationError(
        "Your bid needs to be at least half(rounded up) of the last bid"
      )
    );
  });

  test("bid aces too low with previous bid being aces", () => {
    room.prevBid = {
      playerId: player1.id,
      action: "raise",
      amount: 3,
      dice: 1,
    };
    const new_bid = {
      playerId: player2.id,
      action: "aces",
      amount: 3,
      dice: 1,
    };
    expect(() => room.bidAces(new_bid)).toThrow(
      validationError("Cannot bid same amount or less of 1s")
    );
  });
});

describe("bid call", () => {
  const player1Dice = [2, 3, 1, 5, 6];
  const player2Dice = [2, 1, 5, 2, 3];
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    player1.dice = Array.from(player1Dice);
    player2.dice = Array.from(player2Dice);
  });

  describe("first round", () => {
    beforeEach(() => {
      room.betsInRound = 1;
    });

    test("person who is called loses dice", () => {
      room.prevBid = {
        playerId: player1.id,
        action: "raise",
        amount: 4,
        dice: 2,
      };
      const new_bid = {
        playerId: player2.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player2.playerName} called ${player1.playerName} on their bet of 4 2s. ${player1.playerName} loses a dice.`,
        players: [
          { playerName: player1.playerName, dice: Array.from(player1Dice) },
          { playerName: player2.playerName, dice: Array.from(player2Dice) },
        ],
      };
      expect(room.bidCall(new_bid)).toStrictEqual(expected);
    });

    test("person who called loses dice", () => {
      room.prevBid = {
        playerId: player1.id,
        action: "raise",
        amount: 3,
        dice: 2,
      };
      const new_bid = {
        playerId: player2.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player2.playerName} called ${player1.playerName} on their bet of 3 2s. ${player2.playerName} loses a dice.`,
        players: [
          { playerName: player1.playerName, dice: Array.from(player1Dice) },
          { playerName: player2.playerName, dice: Array.from(player2Dice) },
        ],
      };
      expect(room.bidCall(new_bid)).toStrictEqual(expected);
    });
  });

  describe("not first round", () => {
    beforeEach(() => {
      room.betsInRound = 4;
    });

    test("person who is called loses dice", () => {
      room.prevBid = {
        playerId: player1.id,
        action: "raise",
        amount: 8,
        dice: 2,
      };
      const new_bid = {
        playerId: player2.id,
        action: "call",
        amount: 8,
        dice: 2,
      };
      const expected = {
        msg: `${player2.playerName} called ${player1.playerName} on their bet of 8 2s. ${player1.playerName} loses a dice.`,
        players: [
          { playerName: player1.playerName, dice: Array.from(player1Dice) },
          { playerName: player2.playerName, dice: Array.from(player2Dice) },
        ],
      };
      expect(room.bidCall(new_bid)).toStrictEqual(expected);
    });

    test("person who called loses dice", () => {
      room.prevBid = {
        playerId: player1.id,
        action: "raise",
        amount: 5,
        dice: 2,
      };
      const new_bid = {
        playerId: player2.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player2.playerName} called ${player1.playerName} on their bet of 5 2s. ${player2.playerName} loses a dice.`,
        players: [
          { playerName: player1.playerName, dice: Array.from(player1Dice) },
          { playerName: player2.playerName, dice: Array.from(player2Dice) },
        ],
      };
      expect(room.bidCall(new_bid)).toStrictEqual(expected);
    });
  });
});

describe("bid spot", () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.newRound();
  });

  describe("correct", () => {
    beforeEach(() => {
      room.betsInRound = 2;
    });

    test("player has 4 dice", () => {
      player1.dice = [2, 3, 1, 5];
      player2.dice = [2, 1, 5, 2, 6];
      room.prevBid = {
        playerId: player2.id,
        action: "raise",
        amount: 5,
        dice: 2,
      };
      const spot_bid = {
        playerId: player1.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player1.playerName} called spot on 5 2s. ${player1.playerName} called spot correctly and gets 1 dice back.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3, 1, 5] },
          { playerName: player2.playerName, dice: [2, 1, 5, 2, 6] },
        ],
      };
      expect(room.bidSpot(spot_bid)).toStrictEqual(expected);
      expect(player2.dice.length).toBe(5);
    });

    test("player already has 5 dice", () => {
      player1.dice = [2, 3, 1, 5, 6];
      player2.dice = [2, 1, 5, 2, 4];
      room.prevBid = {
        playerId: player2.id,
        action: "raise",
        amount: 5,
        dice: 2,
      };
      const spot_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly, however, they already have 5 dice.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3, 1, 5, 6] },
          { playerName: player2.playerName, dice: [2, 1, 5, 2, 4] },
        ],
      };
      expect(room.bidSpot(spot_bid)).toStrictEqual(expected);
      expect(player2.dice.length).toBe(5);
    });

    test("bid spot - correct - second bid (1s dont count)", () => {
      room.betsInRound = 1;
      player1.dice = [2, 3, 1, 5, 6];
      player2.dice = [2, 1, 5, 2];
      room.prevBid = {
        playerId: player1.id,
        action: "raise",
        amount: 3,
        dice: 2,
      };
      const spot_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player2.playerName} called spot on 3 2s. ${player2.playerName} called spot correctly and gets 1 dice back.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3, 1, 5, 6] },
          { playerName: player2.playerName, dice: [2, 1, 5, 2] },
        ],
      };
      expect(room.bidSpot(spot_bid)).toStrictEqual(expected);
      expect(player2.dice.length).toBe(5);
    });
  });

  describe("incorrect", () => {
    const player1Dice = [2, 3, 1, 5, 6];
    const player2Dice = [2, 1, 5, 2, 4];

    beforeEach(() => {
      player1.dice = Array.from(player1Dice);
      player2.dice = Array.from(player2Dice);
      room.betsInRound = 3;
    });

    test("bid spot - incorrect - second bid (1s dont count)", () => {
      room.betsInRound = 1;
      room.prevBid = {
        playerId: player1.id,
        action: "raise",
        amount: 5,
        dice: 2,
      };
      const spot_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot incorrectly and loses 1 dice.`,
        players: [
          { playerName: player1.playerName, dice: Array.from(player1Dice) },
          { playerName: player2.playerName, dice: Array.from(player2Dice) },
        ],
      };
      expect(room.bidSpot(spot_bid)).toStrictEqual(expected);
      expect(player2.dice.length).toBe(4);
    });

    test("bid spot - incorrect", () => {
      room.prevBid = {
        playerId: player1.id,
        action: "raise",
        amount: 6,
        dice: 2,
      };
      const spot_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      const expected = {
        msg: `${player2.playerName} called spot on 6 2s. ${player2.playerName} called spot incorrectly and loses 1 dice.`,
        players: [
          { playerName: player1.playerName, dice: Array.from(player1Dice) },
          { playerName: player2.playerName, dice: Array.from(player2Dice) },
        ],
      };
      expect(room.bidSpot(spot_bid)).toStrictEqual(expected);
      expect(player2.dice.length).toBe(4);
    });
  });
});

describe("bid", () => {
  beforeEach(() => {
    player1.dice = [1, 2, 3, 4];
    player2.dice = [1, 2, 3, 4];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.newRound();
  });

  // We do not need to test all invalid bids because we already wrote more detailed test for validateBid()
  test("bid with invalid bid", () => {
    const b = { playerId: player2.id + 1, action: "raise", amount: 4, dice: 4 };

    expect(() => room.bid(b)).toThrow(
      validationError(`Player with id of ${player2.id + 1} does not exist`)
    );
  });

  describe("raise", () => {
    test("initial bet", () => {
      const bid = { playerId: player1.id, action: "raise", amount: 4, dice: 4 };
      const actual = room.bid(bid);
      const expectedBid = {
        playerId: player1.id,
        playerName: player1.playerName,
        action: "raise",
        amount: 4,
        dice: 4,
      };
      expect(actual).toStrictEqual({ bid: expectedBid });
    });

    test("not initial", () => {
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 3,
        dice: 3,
      };
      const second_bid = {
        playerId: player2.id,
        action: "raise",
        amount: 4,
        dice: 3,
      };
      const second_bid_result = {
        playerId: player2.id,
        playerName: player2.playerName,
        action: "raise",
        amount: 4,
        dice: 3,
      };
      room.bid(first_bid);
      expect(room.bid(second_bid)).toStrictEqual({ bid: second_bid_result });
    });

    test("invalid", () => {
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 3,
        dice: 3,
      };
      const second_bid = {
        playerId: player2.id,
        action: "raise",
        amount: 2,
        dice: 3,
      };
      room.bid(first_bid);
      expect(() => room.bid(second_bid)).toThrow(
        validationError("Raise must raise the amount of dice or the dice")
      );
    });
  });

  describe("aces", () => {
    beforeEach(() => {
      room.bid({ playerId: player1.id, action: "raise", amount: 8, dice: 2 });
    });

    test("bid aces", () => {
      const second_bid = {
        playerId: player2.id,
        action: "aces",
        amount: 4,
        dice: 1,
      };
      const second_bid_result = {
        playerId: player2.id,
        playerName: player2.playerName,
        action: "aces",
        amount: 4,
        dice: 1,
      };
      expect(room.bid(second_bid)).toStrictEqual({ bid: second_bid_result });
    });

    test("bid aces - invalid", () => {
      const second_bid = {
        playerId: player2.id,
        action: "aces",
        amount: 3,
        dice: 1,
      };
      expect(() => room.bid(second_bid)).toThrow(
        validationError(
          "Your bid needs to be at least half(rounded up) of the last bid"
        )
      );
    });
  });

  describe("call", () => {
    test("initial bet", () => {
      const bid = {
        playerId: player1.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      };
      expect(() => room.bid(bid)).toThrow(
        validationError("Cannot call call on initial bet.")
      );
    });

    test("person who is called loses dice - endOfRound", () => {
      room.betsInRound = 2;
      player1.dice = [2, 3, 1, 5, 6];
      player2.dice = [2, 1, 5, 2, 3];
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 8,
        dice: 2,
      };
      const second_bid = {
        playerId: player2.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      };
      room.bid(first_bid);
      const expected = {
        msg: `${player2.playerName} called ${player1.playerName} on their bet of 8 2s. ${player1.playerName} loses a dice.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3, 1, 5, 6] },
          { playerName: player2.playerName, dice: [2, 1, 5, 2, 3] },
        ],
      };
      expect(room.bid(second_bid)).toStrictEqual({ eor: expected });
    });

    test("person who is called loses dice - endOfGame", () => {
      player1.dice = [2, 3];
      player2.dice = [2];
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 1,
        dice: 2,
      };
      const second_bid = {
        playerId: player2.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      };
      room.bid(first_bid);
      const expected = {
        msg: `${player1.playerName} has won the game.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3] },
          { playerName: player2.playerName, dice: [2] },
        ],
      };
      expect(room.bid(second_bid)).toStrictEqual({ eor: expected });
    });
  });

  describe("spot", () => {
    test("initial bet", () => {
      const bid = {
        playerId: player1.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      expect(() => room.bid(bid)).toThrow(
        validationError("Cannot call spot on initial bet.")
      );
    });

    test("correct - endOfRound", () => {
      room.betsInRound = 4;
      player1.dice = [2, 3, 1, 5, 6];
      player2.dice = [2, 1, 5, 2];
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 5,
        dice: 2,
      };
      const second_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      room.bid(first_bid);
      const expected = {
        msg: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly and gets 1 dice back.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3, 1, 5, 6] },
          { playerName: player2.playerName, dice: [2, 1, 5, 2] },
        ],
      };
      expect(room.bid(second_bid)).toStrictEqual({ eor: expected });
    });

    test("correct - first half of game", () => {
      room.betsInRound = 4;
      player1.dice = [2, 3, 3];
      player2.dice = [2, 1];
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 2,
        dice: 2,
      };
      const second_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      room.bid(first_bid);
      const expected = {
        msg: `${player2.playerName} called spot on 2 2s. ${player2.playerName} called spot incorrectly and loses 1 dice.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3, 3] },
          { playerName: player2.playerName, dice: [2, 1] },
        ],
      };
      expect(room.bid(second_bid)).toStrictEqual({ eor: expected });
    });

    test("correct - second bid (not counting 1s)", () => {
      player1.dice = [2, 3, 3];
      player2.dice = [2, 1];
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 2,
        dice: 2,
      };
      const second_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      room.bid(first_bid);
      const expected = {
        msg: `${player2.playerName} called spot on 2 2s. ${player2.playerName} called spot correctly and gets 1 dice back.`,
        players: [
          { playerName: player1.playerName, dice: [2, 3, 3] },
          { playerName: player2.playerName, dice: [2, 1] },
        ],
      };
      expect(room.bid(second_bid)).toStrictEqual({ eor: expected });
    });

    test("incorrect- second half of game", () => {
      player1.dice = [2, 3];
      player2.dice = [2, 1];
      const first_bid = {
        playerId: player1.id,
        action: "raise",
        amount: 2,
        dice: 2,
      };
      room.betsInRound = 4;
      const second_bid = {
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      };
      room.bid(first_bid);
      expect(() => room.bid(second_bid)).toThrow(
        validationError("Cannot call spot in the second half of a game")
      );
    });
  });
});

describe("whose turn", () => {
  beforeEach(() => {
    player1.dice = [1, 2, 3, 4];
    player2.dice = [1, 2, 3, 4];
    room.addPlayer(player1);
    room.addPlayer(player2);
    player3 = {
      id: "3",
      playerName: "name3",
      disconnected: false,
      dice: [1, 2, 3, 4],
      diceCount: 4,
    };
    room.addPlayer(player3);
    room.newRound();
  });

  test("initial bet", () => {
    expect(room.whoseTurn()).toBe(player1.id);
  });

  test("second bet", () => {
    let res = room.bid({
      playerId: player1.id,
      action: "raise",
      amount: 1,
      dice: 2,
    });
    expect(room.whoseTurn()).toBe(player2.id);
  });

  test("going back to start", () => {
    room.bid({ playerId: player1.id, action: "raise", amount: 1, dice: 2 });
    room.bid({ playerId: player2.id, action: "raise", amount: 2, dice: 2 });
    room.bid({ playerId: player3.id, action: "raise", amount: 3, dice: 2 });
    expect(room.whoseTurn()).toBe(player1.id);
  });

  describe("after a call", () => {
    beforeEach(() => {
      player1.dice = [2, 2, 2, 2, 2];
      player2.dice = [2, 2, 2, 2, 2];
      player3.dice = [];
    });

    test("lose", () => {
      room.bid({ playerId: player1.id, action: "raise", amount: 1, dice: 2 });
      room.bid({
        playerId: player2.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      });
      expect(room.whoseTurn()).toBe(player2.id);
    });

    test("win", () => {
      room.bid({ playerId: player1.id, action: "raise", amount: 1, dice: 3 });
      room.bid({
        playerId: player2.id,
        action: "call",
        amount: undefined,
        dice: undefined,
      });
      expect(room.whoseTurn()).toBe(player1.id);
    });
  });

  describe("after a spot", () => {
    beforeEach(() => {
      player1.dice = [2, 2, 2, 2, 2];
      player2.dice = [2, 2, 2, 2, 2];
      player3.dice = [];
    });

    test("player2s turn", () => {
      room.bid({ playerId: player1.id, action: "raise", amount: 1, dice: 2 });
      room.bid({
        playerId: player2.id,
        action: "spot",
        amount: undefined,
        dice: undefined,
      });
      expect(room.whoseTurn()).toBe(player2.id);
    });
  });
});

describe("turn taking", () => {
  beforeEach(() => {
    player1.dice = [1, 2, 3, 4];
    player2.dice = [1, 2, 3, 4];
    room.addPlayer(player1);
    room.addPlayer(player2);
    player3 = {
      id: "3",
      playerName: "name3",
      disconnected: false,
      dice: [1, 2, 3, 4],
      diceCount: 4,
    };
    room.addPlayer(player3);
    room.newRound();
  });

  test("turn taking - 1 round", () => {
    const first_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 2,
      dice: 2,
    };
    const second_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 3,
      dice: 2,
    };
    const third_bid = {
      playerId: player3.id,
      action: "raise",
      amount: 4,
      dice: 2,
    };
    const third_bid_result = {
      playerId: player3.id,
      playerName: player3.playerName,
      action: "raise",
      amount: 4,
      dice: 2,
    };

    room.bid(first_bid);
    room.bid(second_bid);
    expect(room.bid(third_bid)).toStrictEqual({ bid: third_bid_result });
  });

  test("turn taking - 2 rounds", () => {
    const first_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 2,
      dice: 2,
    };
    const second_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 3,
      dice: 2,
    };
    const third_bid = {
      playerId: player3.id,
      action: "raise",
      amount: 4,
      dice: 2,
    };
    const fourth_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 5,
      dice: 2,
    };
    const fifth_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 6,
      dice: 2,
    };
    const sixth_bid = {
      playerId: player3.id,
      action: "raise",
      amount: 7,
      dice: 2,
    };
    const sixth_bid_result = {
      playerId: player3.id,
      playerName: player3.playerName,
      action: "raise",
      amount: 7,
      dice: 2,
    };

    room.bid(first_bid);
    room.bid(second_bid);
    room.bid(third_bid);
    room.bid(fourth_bid);
    room.bid(fifth_bid);
    expect(room.bid(sixth_bid)).toStrictEqual({ bid: sixth_bid_result });
  });

  test("turn taking - player 1 goes before player 3", () => {
    const first_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 2,
      dice: 2,
    };
    const second_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 3,
      dice: 2,
    };
    const third_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 4,
      dice: 2,
    };

    room.bid(first_bid);
    room.bid(second_bid);
    expect(() => room.bid(third_bid)).toThrow(
      validationError(`It is not ${player1.playerName}s turn`)
    );
  });

  test("turn taking - player 2 goes before player 1", () => {
    const first_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 2,
      dice: 2,
    };
    const second_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 3,
      dice: 2,
    };
    const third_bid = {
      playerId: player3.id,
      action: "raise",
      amount: 4,
      dice: 2,
    };
    const fourth_bid = {
      playerId: player2.id,
      action: "raise",
      amount: 5,
      dice: 2,
    };

    room.bid(first_bid);
    room.bid(second_bid);
    room.bid(third_bid);
    expect(() => room.bid(fourth_bid)).toThrow(
      validationError(`It is not ${player2.playerName}s turn`)
    );
  });

  test("turn taking - player 3 goes before player 2", () => {
    const first_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 2,
      dice: 2,
    };
    const second_bid = {
      playerId: player3.id,
      action: "raise",
      amount: 3,
      dice: 2,
    };

    room.bid(first_bid);
    expect(() => room.bid(second_bid)).toThrow(
      validationError(`It is not ${player3.playerName}s turn`)
    );
  });

  test("tun taking - player 1 tries to go twice", () => {
    const first_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 2,
      dice: 2,
    };
    const second_bid = {
      playerId: player1.id,
      action: "raise",
      amount: 3,
      dice: 2,
    };

    room.bid(first_bid);
    expect(() => room.bid(second_bid)).toThrow(
      validationError(`It is not ${player1.playerName}s turn`)
    );
  });
});
