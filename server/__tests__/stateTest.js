const { createRoom, addPlayer, getPlayer, removePlayer, getPlayers, getRoom } = require('../state');
const { Player } = require("../player");

const roomCode = 'room';
const player1 = new Player(0, 'player1');
const player2 = new Player(1, 'player2');

describe('create room', () => {
    test('create room', () => {
        expect(createRoom(roomCode)).toStrictEqual({});
    })

    test('create room duplicate', () => {
        expect(createRoom(roomCode)).toStrictEqual({ error: 'Room already exists' });
    })
})

describe('add player', () => {
    test('add player', () => {
        const { newPlayer } = addPlayer(player1.id, player1.playerName, roomCode);
        expect(newPlayer.id).toBe(player1.id);
        expect(newPlayer.playerName).toBe(player1.playerName);
        expect(getPlayers(roomCode)).toStrictEqual([{ playerName: player1.playerName, diceCount: 5 }])
    })

    test('add player duplicate', () => {
        expect(addPlayer(player1.id, player1.playerName, roomCode)).toStrictEqual({ error: 'Username already exists' });
    })

    test('add player room does not exists', () => {
        expect(addPlayer(player1.id, player1.playerName, 'invalid')).toStrictEqual({ error: 'Room does not exist' });
    })

    test('add player missing name', () => {
        expect(addPlayer(player1.id, undefined, roomCode)).toStrictEqual({ error: 'Username is required' });
    })

    test('add player missing room code', () => {
        expect(addPlayer(player1.id, player1.playerName, undefined)).toStrictEqual({ error: 'Room is required' });
    })

    test('add player missing name and room code', () => {
        expect(addPlayer(player1.id)).toStrictEqual({ error: 'Username and room are required' });
    })
})

describe('get player', () => {
    test('get player', () => {
        expect(getPlayer(player1.id)).toStrictEqual(player1);
    })

    test('get player does not exist', () => {
        expect(getPlayer(5)).toBe(undefined);
    })

    test('get players', () => {
        expect(getPlayers(roomCode)).toStrictEqual([{ playerName: player1.playerName, diceCount: 5 }]);
    })

    test('get players invalid room code', () => {
        expect(getPlayers('invalid')).toBe(undefined);
    })
})

describe('get room', () => {
    test('get room', () => {
        expect(getRoom(player1.id).roomCode).toBe(roomCode);
    })

    test('get room does not exist', () => {
        expect(getRoom(5)).toBe(undefined);
    })
})

describe('remove player', () => {
    test('remove player', () => {
        expect(removePlayer(player1.id)).toStrictEqual(player1);
    })

    test('remove player does not exists', () => {
        expect(removePlayer(player1.id)).toBe(undefined);
    })
})