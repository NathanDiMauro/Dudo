const { Room } = require("../room");
const { Player } = require("../player");

let room, player1, player2, player3;

beforeEach(() => {
  room = new Room('1234');
  player1 = new Player('0', 'name');
  player2 = new Player('1', 'name2');
})

afterEach(() => {
  room = null;
  player1 = null;
  player2 = null;
  player3 = null;
})

describe('adding player', () => {
  test('add player', () => {
    room.addPlayer(player1);
    expect(room.players.length).toBe(1);
  })
})

describe('remove player', () => {
  test('remove player testing count', () => {
    room.addPlayer(player1);
    room.removePlayer('0');
    expect(room.players.length).toBe(0);
  })

  test('remove player testing return', () => {
    room.addPlayer(player1);
    expect(room.removePlayer('0')).toBe(player1);
  })

  test('remove player with invalid id', () => {
    expect(room.removePlayer('0')).toBe(undefined);
  })
})

describe('get player', () => {
  test('get player', () => {
    const newPlayer = player1;
    room.addPlayer(newPlayer);
    expect(room.getPlayer('0')).toBe(newPlayer);
  })

  test('get player with invalid id', () => {
    expect(room.getPlayer('0')).toBe(undefined);
  })

})

describe('get players brief', () => {
  test('get players brief', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getPlayersBrief()).toStrictEqual([{ playerName: player1.playerName, diceCount: 5 }, { playerName: player2.playerName, diceCount: 5 }])
  })
})

describe('get remaining players', () => {
  test('get reaming players - 0', () => {
    expect(room.getRemainingPlayers()).toBe(0);
  })

  test('get reaming players - 1', () => {
    room.addPlayer(player1);
    expect(room.getRemainingPlayers()).toBe(1);
  })

  test('get reaming players - 2', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getRemainingPlayers()).toBe(2);
  })

  test('get reaming players - 4', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getRemainingPlayers()).toBe(4);
  })

  test('get reaming players with 1 player out of dice', () => {
    player3 = new Player('3', 'name3')
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.addPlayer(player3);
    player3.dice = [];
    expect(room.getRemainingPlayers()).toBe(2);
  })

  test('get reaming players with 2 player out of dice', () => {
    player3 = new Player('3', 'name3')
    const player4 = new Player('4', 'name4')
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.addPlayer(player3);
    room.addPlayer(player4);
    player3.dice = [];
    player4.dice = [];
    expect(room.getRemainingPlayers()).toBe(2);
  })
})

describe('get winner', () => {
  test('get winner', () => {
    room.addPlayer(player1);
    expect(room.getWinner()).toBe(player1);
  })

  test('get winner - 2 players left', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getWinner()).toBe(undefined);
  })
})


describe('player exists', () => {
  test('player exists by name', () => {
    room.addPlayer(player1);
    expect(room.playerExistsByName('name')).toBeTruthy();
  })

  test('player exists by name with invalid name', () => {
    expect(room.playerExistsByName('name')).toBeFalsy();
  })

  test('player exists by id', () => {
    room.addPlayer(player1);
    expect(room.playerExistsById('0')).toBeTruthy();
  })

  test('player exists by id with invalid id', () => {
    expect(room.playerExistsById('0')).toBeFalsy();
  })

})

describe('count of dice', () => {
  test('count of dice in room', () => {
    room.addPlayer(player1);
    expect(room.countOfDice()).toBe(5);
  });
});

describe('count of specific die', () => {
  test('count of dice on first bet', () => {
    player1.dice = [2, 3, 2, 4, 1];
    player2.dice = [6, 4, 2, 1, 1];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.betsInRound = 1;
    expect(room.countOfSpecificDie(2)).toBe(3);
  })

  test('count of dice on second bet', () => {
    player1.dice = [2, 3, 2, 4, 1];
    player2.dice = [6, 4, 2, 1, 1];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.betsInRound = 2;
    expect(room.countOfSpecificDie(2)).toBe(6);
  })
})

describe('populate dice', () => {
  test('populate player dice', () => {
    room.addPlayer(player1);
    player1.dice = [-1, -1, -1, -1, -1];
    room.populatePlayerDice();
    expect(player1.dice).not.toBe([-1, -1, -1, -1, -1])
    expect(player1.dice[0]).toBeGreaterThan(0);
    expect(player1.dice[0]).toBeLessThan(7);
  })
})

describe('validate bid', () => {
  beforeEach(() => {
    room.addPlayer(player1);
  })
  test('validate bid', () => {
    const bid = { playerId: player1.id, action: 'raise', amount: 4, dice: 4 };
    expect(room.validateBid(bid)).toBe(undefined)
  })

  test('validate bid call/spot with null numbers', () => {
    const bid = { playerId: player1.id, action: 'call', amount: null, dice: null };
    expect(room.validateBid(bid)).toBe(undefined)
  })

  test('validate bid with player going 2 times in a row', () => {
    room.addPlayer(player2);
    const bid = { playerId: player1.id, action: 'call', amount: 4, dice: 4 };
    room.prevBid = bid;
    expect(room.validateBid(bid)).toStrictEqual({ error: `It is not ${player1.playerName}s turn` });
  })

  test('validate bid with invalid playerId', () => {
    const bid = { playerId: 2, action: 'call', amount: 4, dice: 4 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Player with id of 2 does not exist' });
  })

  test('validate bid with invalid bid action', () => {
    const bid = { playerId: player1.id, action: 'invalid', amount: 4, dice: 4 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Invalid bid action: invalid' });
  })

  test('validate bid with invalid die amount', () => {
    const bid = { playerId: player1.id, action: 'call', amount: 6, dice: 4 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'There are only 5 dice left in the game. 6 is too high' });
  })

  test('validate bid with invalid dice - negative', () => {
    const bid = { playerId: player1.id, action: 'raise', amount: 4, dice: -1 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Dice must be 1, 2, 3, 4, 5 , or 6. Not -1' });
  })

  test('validate bid with invalid dice - zero', () => {
    const bid = { playerId: player1.id, action: 'raise', amount: 4, dice: 0 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Dice must be 1, 2, 3, 4, 5 , or 6. Not 0' });
  })

  test('validate bid with invalid dice - positive', () => {
    const bid = { playerId: player1.id, action: 'raise', amount: 4, dice: 10 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Dice must be 1, 2, 3, 4, 5 , or 6. Not 10' });
  })
})

describe('check aces', () => {
  beforeEach(() => {
    room.addPlayer(player1);
  })

  test('check aces', () => {
    const bid = { playerId: player1.id, action: 'aces', amount: 3, dice: 1 };
    room.prevBid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    expect(room.checkAces(bid)).toBe(undefined);
  })

  test('check aces bid reg too low', () => {
    const bid = { playerId: player1.id, action: 'aces', amount: 2, dice: 2 };
    room.prevBid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    expect(room.checkAces(bid)).toStrictEqual({ error: 'Since the last bid was 1 1s, the next bid must be at least 3 of any dice' });
  })

  test('check aces bid aces too low', () => {
    const bid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    room.prevBid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    expect(room.checkAces(bid)).toStrictEqual({ error: 'Cannot bid same amount or less of ones' });
  })
})

/****** Bid Raise ******/

describe('bid raise', () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
  })

  test('bid raise higher amount', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 4, dice: 3 };
    const new_bid_result = { playerId: player2.id, playerName: player2.playerName, action: 'raise', amount: 4, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ bid: new_bid_result });
  })

  test('bid raise higher dice', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 4 };
    const new_bid_result = { playerId: player2.id, playerName: player2.playerName, action: 'raise', amount: 3, dice: 4 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ bid: new_bid_result });
  })

  test('bid raises same amount and same dice', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })

  test('bid raise lower amount same dice', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 2, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })

  test('bid raise same amount lower dice', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 2, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })
})

/****** Bid Aces ******/
describe('bid aces', () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
  })

  test('bid aces', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 4, dice: 1 }
    const new_bid_result = { playerId: player2.id, playerName: player2.playerName, action: 'aces', amount: 4, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ bid: new_bid_result });
  })

  test('bid aces with previous bid being aces', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 1 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 4, dice: 1 }
    const new_bid_result = { playerId: player2.id, playerName: player2.playerName, action: 'aces', amount: 4, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ bid: new_bid_result });
  })

  test('bid aces too low', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 3, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ error: 'Your bid needs to be at least half(rounded up) of the last bid' });
  })

  test('bid aces too low with previous bid being aces', () => {
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 1 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 3, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ error: 'Cannot bid same amount or less of 1s' });
  })
})

describe('bid call', () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
  })

  test('bid call - not first round - person who is called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'call', amount: 8, dice: 2 };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 8 2s. ${player1.playerName} loses a dice.` })
  })

  test('bid call - not first round - person who called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 5 2s. ${player2.playerName} loses a dice.` })
  })

  test('bid call - first round - person who is called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 4, dice: 2 };
    room.betsInRound = 1;
    const new_bid = { playerId: player2.id, action: 'call', amount: 4, dice: 2 };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 4 2s. ${player1.playerName} loses a dice.` })
  })

  test('bid call - first round - person who called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 2 };
    room.betsInRound = 1;
    const new_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 3 2s. ${player2.playerName} loses a dice.` })
  })
})

describe('bid spot', () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
  })

  test('bid spot - correct', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly and gets 1 dice back.` });
    expect(player2.dice.length).toBe(5);
  })

  test('bid spot - correct - player already has 5 dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 4];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly, however, they already have 5 dice.` });
    expect(player2.dice.length).toBe(5);
  })

  test('bid spot - incorrect - second bid (1s dont count)', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 4];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 1;
    const new_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot incorrectly and loses 1 dice.` });
    expect(player2.dice.length).toBe(4);
  })

  test('bid spot - correct - second bid (1s dont count)', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 2 };
    room.betsInRound = 1;
    const new_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 3 2s. ${player2.playerName} called spot correctly and gets 1 dice back.` });
    expect(player2.dice.length).toBe(5);
  })


  test('bid spot - incorrect', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 4];
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 6, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 6 2s. ${player2.playerName} called spot incorrectly and loses 1 dice.` });
    expect(player2.dice.length).toBe(4);
  })

})

describe('bid', () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.newRound();
  })

  // We do not need to test all invalid bids because we already wrote more detailed test for validateBid()
  test('bid with invalid bid', () => {
    const actual = room.bid({ playerId: player2.id + 1, action: 'raise', amount: 4, dice: 4 });
    expect(actual).toStrictEqual({ error: `Player with id of ${player2.id + 1} does not exist` });
  })

  test('initial bet', () => {
    const bid = { playerId: player1.id, action: 'raise', amount: 4, dice: 4 };
    const actual = room.bid(bid);
    expect(actual).toStrictEqual({ bid: bid, startOfRound: true });
  })

  test('initial bet - call', () => {
    const bid = { playerId: player1.id, action: 'call', amount: null, dice: null };
    const actual = room.bid(bid);
    expect(actual).toStrictEqual({ error: 'Cannot call call on initial bet.' });
  })

  test('initial bet - spot', () => {
    const bid = { playerId: player1.id, action: 'spot', amount: null, dice: null };
    const actual = room.bid(bid);
    expect(actual).toStrictEqual({ error: 'Cannot call spot on initial bet.' });
  })

  test('bid raise', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 4, dice: 3 };
    const second_bid_result = { playerId: player2.id, playerName: player2.playerName, action: 'raise', amount: 4, dice: 3 };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ bid: second_bid_result });
  })

  test('bid raise - invalid', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 2, dice: 3 };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })

  test('bid aces', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const second_bid = { playerId: player2.id, action: 'aces', amount: 4, dice: 1 }
    const second_bid_result = { playerId: player2.id, playerName: player2.playerName, action: 'aces', amount: 4, dice: 1 }
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ bid: second_bid_result });
  })

  test('bid aces - invalid', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const second_bid = { playerId: player2.id, action: 'aces', amount: 3, dice: 1 }
    room.bid(first_bid)
    expect(room.bid(second_bid)).toStrictEqual({ error: 'Your bid needs to be at least half(rounded up) of the last bid' });
  })

  test('bid call - not first round - person who is called loses dice - endOfRound', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    const first_bid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 };
    room.betsInRound = 2;
    const second_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 8 2s. ${player1.playerName} loses a dice.` })
  })

  test('bid spot - correct - endOfRound', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2];
    const first_bid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const second_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    room.bid(first_bid)
    expect(room.bid(second_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly and gets 1 dice back.` })
  })

  test('bid spot - valid - first half of game', () => {
    player1.dice = [2, 3, 3];
    player2.dice = [2, 1];
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    room.betsInRound = 4;
    const second_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 2 2s. ${player2.playerName} called spot incorrectly and loses 1 dice.` });
  })

  test('bid spot - valid - second bid (not counting 1s)', () => {
    player1.dice = [2, 3, 3];
    player2.dice = [2, 1];
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    const second_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 2 2s. ${player2.playerName} called spot correctly and gets 1 dice back.` });
  })

  test('bid spot - invalid - second half of game', () => {
    player1.dice = [2, 3];
    player2.dice = [2, 1];
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    room.betsInRound = 4;
    const second_bid = { playerId: player2.id, action: 'spot', amount: null, dice: null };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ error: 'Cannot call spot in the second half of a game' });
  })

  test('bid call - not first round - person who is called loses dice - endOfGame', () => {
    player1.dice = [2, 3];
    player2.dice = [2];
    const first_bid = { playerId: player1.id, action: 'raise', amount: 1, dice: 2 };
    const second_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ endOfGame: `${player1.playerName} has won the game.` })
  })

})

describe('turn taking', () => {
  beforeEach(() => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    player3 = new Player('3', 'name3');
    room.addPlayer(player3);
    room.newRound();
  })

  test('turn taking - 1 round', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 2 };
    const third_bid = { playerId: player3.id, action: 'raise', amount: 4, dice: 2 };
    const third_bid_result = { playerId: player3.id, playerName: player3.playerName, action: 'raise', amount: 4, dice: 2 };

    room.bid(first_bid)
    room.bid(second_bid)
    expect(room.bid(third_bid)).toStrictEqual({ bid: third_bid_result })
  })

  test('turn taking - 2 rounds', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 2 };
    const third_bid = { playerId: player3.id, action: 'raise', amount: 4, dice: 2 };
    const fourth_bid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    const fifth_bid = { playerId: player2.id, action: 'raise', amount: 6, dice: 2 };
    const sixth_bid = { playerId: player3.id, action: 'raise', amount: 7, dice: 2 };
    const sixth_bid_result = { playerId: player3.id, playerName: player3.playerName, action: 'raise', amount: 7, dice: 2 };


    room.bid(first_bid)
    room.bid(second_bid)
    room.bid(third_bid)
    room.bid(fourth_bid)
    room.bid(fifth_bid)
    expect(room.bid(sixth_bid)).toStrictEqual({ bid: sixth_bid_result })
  })

  test('turn taking - player 1 goes before player 3', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 2 };
    const third_bid = { playerId: player1.id, action: 'raise', amount: 4, dice: 2 };

    room.bid(first_bid)
    room.bid(second_bid)
    expect(room.bid(third_bid)).toStrictEqual({ error: `It is not ${player1.playerName}s turn` })
  })

  test('turn taking - player 2 goes before player 1', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 2 };
    const third_bid = { playerId: player3.id, action: 'raise', amount: 4, dice: 2 };
    const fourth_bid = { playerId: player2.id, action: 'raise', amount: 5, dice: 2 };

    room.bid(first_bid)
    room.bid(second_bid)
    room.bid(third_bid)
    expect(room.bid(fourth_bid)).toStrictEqual({ error: `It is not ${player2.playerName}s turn` })
  })

  test('turn taking - player 3 goes before player 2', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    const second_bid = { playerId: player3.id, action: 'raise', amount: 3, dice: 2 };

    room.bid(first_bid)
    expect(room.bid(second_bid)).toStrictEqual({ error: `It is not ${player3.playerName}s turn` })
  })

  test('tun taking - player 1 tries to go twice', () => {
    const first_bid = { playerId: player1.id, action: 'raise', amount: 2, dice: 2 };
    const second_bid = { playerId: player1.id, action: 'raise', amount: 3, dice: 2 };

    room.bid(first_bid)
    expect(room.bid(second_bid)).toStrictEqual({ error: `It is not ${player1.playerName}s turn` })
  })

})