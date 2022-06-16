const { createRoom, addPlayer, getPlayer, removePlayer, getPlayers, getRoom } = require('../src/state');
const { Player } = require("../src/player");
const { Room } = require('../src/room');

const roomCode = 'room';
const player1 = new Player(0, 'player1');
const player2 = new Player(1, 'player2');

describe('create room', () => {
    test('correct', () => {
        expect(createRoom(roomCode)).toStrictEqual({});
    })

    test('incorrect - duplicate', () => {
        expect(createRoom(roomCode)).toStrictEqual({ error: 'Room already exists' });
    })
})

describe('add player', () => {
    test('correct', () => {
        const { newPlayer } = addPlayer(player1.id, player1.playerName, roomCode);
        expect(newPlayer.id).toBe(player1.id);
        expect(newPlayer.playerName).toBe(player1.playerName);
        expect(getPlayers(roomCode)).toStrictEqual([{ playerName: player1.playerName, diceCount: 5, disconnected: false }])
    })

    describe('incorrect', () => {
        test('duplicate', () => {
            expect(addPlayer(player1.id, player1.playerName, roomCode)).toStrictEqual({ error: 'Username already exists' });
        })

        test('room does not exists', () => {
            expect(addPlayer(player1.id, player1.playerName, 'invalid')).toStrictEqual({ error: 'Room does not exist' });
        })

        test('missing name', () => {
            expect(addPlayer(player1.id, undefined, roomCode)).toStrictEqual({ error: 'Username is required' });
        })

        test('missing room code', () => {
            expect(addPlayer(player1.id, player1.playerName, undefined)).toStrictEqual({ error: 'Room is required' });
        })

        test('missing name and room code', () => {
            expect(addPlayer(player1.id)).toStrictEqual({ error: 'Username and room are required' });
        })
    })
})

describe('get player', () => {
    test('correct', () => {
        expect(getPlayer(player1.id)).toStrictEqual(player1);
    })

    test('player does not exist', () => {
        expect(getPlayer(5)).toBe(undefined);
    })
})

describe('get players', () => {
    test('correct', () => {
        expect(getPlayers(roomCode)).toStrictEqual([{ playerName: player1.playerName, diceCount: 5, disconnected: false }]);
    })

    test('invalid room code', () => {
        expect(getPlayers('invalid')).toBe(undefined);
    })
})

describe('get room', () => {
    test('correct', () => {
        expect(getRoom(player1.id).roomCode).toBe(roomCode);
    })

    test('room does not exist', () => {
        expect(getRoom(5)).toBe(undefined);
    })
})

describe('remove player', () => {
    test('correct', () => {
        expect(removePlayer(player1.id)).toStrictEqual({ player: player1, roomCode: roomCode });
    })

    test('player does not exists', () => {
        expect(removePlayer(player1.id)).toBe(undefined);
    })
})