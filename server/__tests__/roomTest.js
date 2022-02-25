const Player = require("../players").Player;
const Room = require("../players").Room;

let room, player1;

beforeEach(() => {
  room = new Room('1234');
  player1 = new Player(0, 'name');
})

afterEach(() => {
  room = null;
  player1 = null;
})

test('add player', () => {
  room.addPlayer(player1);
  expect(room.players.length).toBe(1);
})

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

test('get player', () => {
  const newPlayer = player1;
  room.addPlayer(newPlayer);
  expect(room.getPlayer(0)).toBe(newPlayer);
})

test('get player with invalid id', () => {
  expect(room.getPlayer(0)).toBe(undefined);
})

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

test('count of dice in room', () => {
  room.addPlayer(player1);
  expect(room.countOfDice()).toBe(5);
});

test('populate player dice', () => {
  room.addPlayer(player1);
  player1.dice = [-1, -1, -1, -1, -1];
  room.populatePlayerDice();
  expect(player1.dice).not.toBe([-1, -1, -1, -1, -1])
  expect(player1.dice[0]).toBeGreaterThan(0);
  expect(player1.dice[0]).toBeLessThan(7);
})


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



