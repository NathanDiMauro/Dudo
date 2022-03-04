const { Room } = require("../room");
const { Player } = require("../player");

let room, player1, player2;

beforeEach(() => {
  room = new Room('1234');
  player1 = new Player(0, 'name');
  player2 = new Player(1, 'name2');
})

afterEach(() => {
  room = null;
  player1 = null;
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
    room.removePlayer(0);
    expect(room.players.length).toBe(0);
  })

  test('remove player testing return', () => {
    room.addPlayer(player1);
    expect(room.removePlayer(0)).toBe(player1);
  })

  test('remove player with invalid id', () => {
    expect(room.removePlayer(0)).toBe(undefined);
  })
})

describe('get player', () => {
  test('get player', () => {
    const newPlayer = player1;
    room.addPlayer(newPlayer);
    expect(room.getPlayer(0)).toBe(newPlayer);
  })

  test('get player with invalid id', () => {
    expect(room.getPlayer(0)).toBe(undefined);
  })

})

describe('get players brief', () => {
  test('get players brief', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.getPlayersBrief()).toStrictEqual([{ playerName: player1.playerName, diceCount: 5 }, { playerName: player2.playerName, diceCount: 5 }])
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
    expect(room.playerExistsById(0)).toBeTruthy();
  })

  test('player exists by id with invalid id', () => {
    expect(room.playerExistsById(0)).toBeFalsy();
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
  test('validate bid', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'call', amount: 4, dice: 4 };
    expect(room.validateBid(bid)).toBe(undefined)
  })

  test('validate bid with player going 2 times in a row', () => {
    room.addPlayer(player1);
    const bid = { playerId: 2, action: 'call', amount: 4, dice: 4 };
    room.prevBid = bid;
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Player cannot bid 2 times in a row' });
  })

  test('validate bid with invalid playerId', () => {
    room.addPlayer(player1);
    const bid = { playerId: 2, action: 'call', amount: 4, dice: 4 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Player with id of 2 does not exist' });
  })

  test('validate bid with invalid bid action', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'invalid', amount: 4, dice: 4 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Invalid bid action: invalid' });
  })

  test('validate bid with invalid die amount', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'call', amount: 6, dice: 4 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'There are only 5 dice left in the game. 6 is too high' });
  })

  test('validate bid with invalid dice - negative', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'call', amount: 4, dice: -1 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Dice must be 1, 2, 3, 4, 5 , or 6. Not -1' });
  })

  test('validate bid with invalid dice - zero', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'call', amount: 4, dice: 0 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Dice must be 1, 2, 3, 4, 5 , or 6. Not 0' });
  })

  test('validate bid with invalid dice - positive', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'call', amount: 4, dice: 10 };
    expect(room.validateBid(bid)).toStrictEqual({ error: 'Dice must be 1, 2, 3, 4, 5 , or 6. Not 10' });
  })
})

describe('check aces', () => {
  test('check aces', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'aces', amount: 3, dice: 1 };
    room.prevBid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    expect(room.checkAces(bid)).toBe(undefined);
  })

  test('check aces bid reg too low', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'aces', amount: 2, dice: 2 };
    room.prevBid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    expect(room.checkAces(bid)).toStrictEqual({ error: 'Since the last bid was 1 1s, the next bid must be at least 3 of any dice' });
  })

  test('check aces bid aces too low', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    room.prevBid = { playerId: player1.id, action: 'aces', amount: 1, dice: 1 };
    expect(room.checkAces(bid)).toStrictEqual({ error: 'Cannot bid same amount or less of ones' });
  })
})

/****** Bid Raise ******/

describe('bid raise', () => {
  test('bid raise higher amount', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 4, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ bid: new_bid });
  })

  test('bid raise higher dice', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 4 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ bid: new_bid });
  })

  test('bid raises same amount and same dice', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 3, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })

  test('bid raise lower amount same dice', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 2, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })

  test('bid raise same amount lower dice', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const new_bid = { playerId: player2.id, action: 'raise', amount: 2, dice: 3 };
    expect(room.bidRaise(new_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })
})

/****** Bid Aces ******/
describe('bid aces', () => {
  test('bid aces', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 4, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ bid: new_bid });
  })

  test('bid aces with previous bid being aces', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 1 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 4, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ bid: new_bid });
  })

  test('bid aces too low', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 3, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ error: 'Your bid needs to be at least half(rounded up) of the last bid' });
  })

  test('bid aces too low with previous bid being aces', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 1 }
    const new_bid = { playerId: player2.id, action: 'aces', amount: 3, dice: 1 }
    expect(room.bidAces(new_bid)).toStrictEqual({ error: 'Cannot bid same amount or less of 1s' });
  })
})

describe('bid call', () => {
  test('bid call - not first round - person who is called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'call', amount: 8, dice: 2 };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 8 2s. ${player1.playerName} loses a dice.` })
  })

  test('bid call - not first round - person who called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 5 2s. ${player2.playerName} loses a dice.` })
  })

  test('bid call - first round - person who is called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 4, dice: 2 };
    room.betsInRound = 1;
    const new_bid = { playerId: player2.id, action: 'call', amount: 4, dice: 2 };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 4 2s. ${player1.playerName} loses a dice.` })
  })

  test('bid call - first round - person who called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 3, dice: 2 };
    room.betsInRound = 1;
    const new_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    expect(room.bidCall(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 3 2s. ${player2.playerName} loses a dice.` })
  })
})

describe('bid spot', () => {
  test('bid spot - correct', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly and gets 1 dice back.` })
  })

  test('bid spot - correct - player already has 5 dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 4];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly, however, they already have 5 dice.` })
  })


  test('bid spot - incorrect', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 4];
    room.addPlayer(player1);
    room.addPlayer(player2);
    room.prevBid = { playerId: player1.id, action: 'raise', amount: 6, dice: 2 };
    room.betsInRound = 4;
    const new_bid = { playerId: player2.id, action: 'call', amount: null, dice: null };
    expect(room.bidSpot(new_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 6 2s. ${player2.playerName} called spot incorrectly and loses 1 dice.` })
  })

})


describe('bid', () => {
  // We do not need to test all invalid bids because we already wrote more detailed test for validateBid()
  test('bid with invalid bid', () => {
    room.addPlayer(player1);
    const actual = room.bid({ playerId: player1.id + 1, action: 'raise', amount: 4, dice: 4 });
    expect(actual).toStrictEqual({ error: `Player with id of ${player1.id + 1} does not exist` });
  })

  test('initial bet', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'raise', amount: 4, dice: 4 };
    const actual = room.bid(bid);
    expect(actual).toStrictEqual({ bid: bid });
  })

  test('initial bet - call', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'call', amount: 4, dice: 4 };
    const actual = room.bid(bid);
    expect(actual).toStrictEqual({ error: 'Cannot call call on initial bet.' });
  })

  test('initial bet - spot', () => {
    room.addPlayer(player1);
    const bid = { playerId: player1.id, action: 'spot', amount: 4, dice: 4 };
    const actual = room.bid(bid);
    expect(actual).toStrictEqual({ error: 'Cannot call spot on initial bet.' });
  })

  test('bid raise', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    const first_bid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 4, dice: 3 };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ bid: second_bid });
  })

  test('bid raise - invalid', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    const first_bid = { playerId: player1.id, action: 'raise', amount: 3, dice: 3 };
    const second_bid = { playerId: player2.id, action: 'raise', amount: 2, dice: 3 };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ error: 'Raise must raise the amount of dice or the dice' });
  })

  test('bid aces', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    const first_bid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const second_bid = { playerId: player2.id, action: 'aces', amount: 4, dice: 1 }
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ bid: second_bid });
  })

  test('bid aces - invalid', () => {
    room.addPlayer(player1);
    room.addPlayer(player2);
    const first_bid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 }
    const second_bid = { playerId: player2.id, action: 'aces', amount: 3, dice: 1 }
    room.bid(first_bid)
    expect(room.bid(second_bid)).toStrictEqual({ error: 'Your bid needs to be at least half(rounded up) of the last bid' });
  })

  test('bid call - not first round - person who is called loses dice', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2, 3];
    room.addPlayer(player1);
    room.addPlayer(player2);
    const first_bid = { playerId: player1.id, action: 'raise', amount: 8, dice: 2 };
    room.betsInRound = 2;
    const second_bid = { playerId: player2.id, action: 'call', amount: 8, dice: 2 };
    room.bid(first_bid);
    expect(room.bid(second_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called ${player1.playerName} on their bet of 8 2s. ${player1.playerName} loses a dice.` })
  })

  test('bid spot - correct', () => {
    player1.dice = [2, 3, 1, 5, 6];
    player2.dice = [2, 1, 5, 2];
    room.addPlayer(player1);
    room.addPlayer(player2);
    const first_bid = { playerId: player1.id, action: 'raise', amount: 5, dice: 2 };
    room.betsInRound = 4;
    const second_bid = { playerId: player2.id, action: 'spot', amount: 5, dice: 2 };
    room.bid(first_bid)
    expect(room.bid(second_bid)).toStrictEqual({ endOfRound: `${player2.playerName} called spot on 5 2s. ${player2.playerName} called spot correctly and gets 1 dice back.` })
  })

})