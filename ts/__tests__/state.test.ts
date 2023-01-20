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
  });

  test("incorrect - duplicate", () => {
    expect(createRoom(roomCode)).toStrictEqual({
      msg: "Room already exists",
    });
  });
});

describe("add player", () => {
  test("correct", () => {
    let newPlayer = addPlayer(player1.id, player1.playerName, roomCode);
    expect(newPlayer.msg).toBeUndefined;
    console.log(newPlayer);
    expect(newPlayer.id).toBe(player1.id);
    expect(newPlayer.playerName).toBe(player1.playerName);
    expect(getPlayers(roomCode)).toStrictEqual([
      { playerName: player1.playerName, diceCount: 0 },
    ]);
  });

  describe("incorrect", () => {
    test("duplicate", () => {
      expect(addPlayer(player1.id, player1.playerName, roomCode)).toStrictEqual(
        { msg: "Username already exists" }
      );
    });

    test("room does not exists", () => {
      expect(
        addPlayer(player1.id, player1.playerName, "invalid")
      ).toStrictEqual({ msg: "Room does not exist" });
    });

    test("missing name", () => {
      expect(addPlayer(player1.id, "", roomCode)).toStrictEqual({
        msg: "Username is required",
      });
    });

    test("missing room code", () => {
      expect(addPlayer(player1.id, player1.playerName, "")).toStrictEqual({
        msg: "Room is required",
      });
    });

    test("missing name and room code", () => {
      expect(addPlayer(player1.id, "", "")).toStrictEqual({
        msg: "Username and room are required",
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
      { playerName: player1.playerName, diceCount: 0 },
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
