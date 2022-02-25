// import test from 'jest';

const Player = require("../players").Player;
const Room = require("../players").Room;

let room;

beforeEach(() => {
  room = new Room('1234');
})

afterEach(() => {
  room = null;
})


test('testing count of dice in room', () => {
  room.addPlayer(new Player(0, 'name'));
  expect(room.countOfDice()).toBe(5);
});





