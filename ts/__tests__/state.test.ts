import { describe, expect, test } from "@jest/globals";
import { Player } from "../../shared/types";
import {
  addPlayer,
  createRoom,
  getPlayer,
  getPlayers,
  getRoom,
  removePlayer,
} from "../src/state";

const roomCode = "room";
const player1: Player = {
  id: "0",
  playerName: "name",
  disconnected: false,
  dice: [1, 2, 3, 4],
  diceCount: 4,
};
const player2: Player = {
  id: "1",
  playerName: "name2",
  disconnected: false,
  dice: [1, 2, 3, 4],
  diceCount: 4,
};
describe("create room", () => {
  test("correct", () => {
    expect(createRoom(roomCode)).toBeUndefined;
  });

  test("incorrect - duplicate", () => {
    expect(createRoom(roomCode)).toStrictEqual({
      msg: "Room already exists",
    });
  });
});

describe("add player", () => {
  test("correct", () => {
    const newPlayer = addPlayer(player1.id, player1.playerName, roomCode);
    expect(newPlayer.msg).toBeUndefined;
    expect(newPlayer.id).toBe(player1.id);
    expect(newPlayer.playerName).toBe(player1.playerName);
    expect(getPlayers(roomCode)).toStrictEqual([
      { playerName: player1.playerName, diceCount: 5, disconnected: false },
    ]);
  });

  describe("incorrect", () => {
    test("duplicate", () => {
      expect(addPlayer(player1.id, player1.playerName, roomCode)).toStrictEqual(
        { error: "Username already exists" }
      );
    });

    test("room does not exists", () => {
      expect(
        addPlayer(player1.id, player1.playerName, "invalid")
      ).toStrictEqual({ error: "Room does not exist" });
    });

    test("missing name", () => {
      expect(addPlayer(player1.id, undefined, roomCode)).toStrictEqual({
        error: "Username is required",
      });
    });

    test("missing room code", () => {
      expect(
        addPlayer(player1.id, player1.playerName, undefined)
      ).toStrictEqual({ error: "Room is required" });
    });

    test("missing name and room code", () => {
      expect(addPlayer(player1.id)).toStrictEqual({
        error: "Username and room are required",
      });
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
    expect(got).toStrictEqual([
      { playerName: player1.playerName, diceCount: 4 },
    ]);
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
