import { describe, expect, test } from "@jest/globals";
import { Player } from "../../shared/types";
import { validationError } from "../src/socket/error";
import { addPlayer, createRoom, getPlayer, getPlayers, getRoom, removePlayer } from "../src/state";

const roomCode = "room";
const player1: Player = {
  id: "0",
  playerName: "name",
  disconnected: false,
  dice: [],
  diceCount: 0,
};
const player2: Player = {
  id: "1",
  playerName: "name2",
  disconnected: false,
  dice: [],
  diceCount: 0,
};
describe("create room", () => {
  test("correct", () => {
    expect(createRoom(roomCode)).toBeUndefined;
    // Make sure the room got created.
    addPlayer(player1.id, player1.playerName, roomCode);
    // Remove the play for the next test.
    removePlayer(player1.id);
  });

  test("incorrect - duplicate", () => {
    expect(() => createRoom(roomCode)).toThrow(validationError("Room already exists"));
  });
});

describe("add player", () => {
  test("correct", () => {
    let newPlayer = addPlayer(player1.id, player1.playerName, roomCode);
    expect(newPlayer.id).toBe(player1.id);
    expect(newPlayer.playerName).toBe(player1.playerName);
    expect(getPlayers(roomCode)).toStrictEqual([{ playerName: player1.playerName, diceCount: 0 }]);
  });

  describe("incorrect", () => {
    test("duplicate", () => {
      expect(() => addPlayer(player1.id, player1.playerName, roomCode)).toThrow(
        validationError("Username already exists in room")
      );
    });

    test("room does not exists", () => {
      expect(() => addPlayer(player1.id, player1.playerName, "invalid")).toThrow(
        validationError("Room does not exist")
      );
    });

    test("missing name", () => {
      expect(() => addPlayer(player1.id, "", roomCode)).toThrow(
        validationError("Username is required")
      );
    });

    test("missing room code", () => {
      expect(() => addPlayer(player1.id, player1.playerName, "")).toThrow(
        validationError("Room is required")
      );
    });

    test("missing name and room code", () => {
      expect(() => addPlayer(player1.id, "", "")).toThrow(
        validationError("Username and room are required")
      );
    });
  });
});

describe("get player", () => {
  test("correct", () => {
    expect(getPlayer(player1.id)).toStrictEqual(player1);
  });

  test("player does not exist", () => {
    const got = getPlayer("5");
    expect(got).toBeUndefined;
  });
});

describe("get players", () => {
  test("correct", () => {
    const got = getPlayers(roomCode);
    expect(got).toBeDefined;
    expect(got).toStrictEqual([{ playerName: player1.playerName, diceCount: 0 }]);
  });

  test("invalid room code", () => {
    expect(getPlayers("invalid")).toBe(undefined);
  });
});

describe("get room", () => {
  test("correct", () => {
    const got = getRoom(player1.id);
    expect(got).toBeDefined;
    expect(got!.roomCode).toBe(roomCode);
  });

  test("room does not exist", () => {
    const got = getRoom(player1.id);
    expect(got).toBeUndefined;
  });
});

describe("remove player", () => {
  test("correct", () => {
    expect(removePlayer(player1.id)).toStrictEqual({
      player: player1,
      roomCode: roomCode,
    });
  });

  test("player does not exists", () => {
    expect(removePlayer(player1.id)).toBe(undefined);
  });
});
