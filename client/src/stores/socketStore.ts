import { writable } from "svelte/store";
import { newSocket } from "../socket";
import type {
  Bid,
  EndOfRoundDice,
  Notification,
  Player,
  Socket,
} from "../types/types";

const socketStore = writable<Socket>({
  socket: newSocket(),
  name: "",
  roomCode: "",
  players: [],
  notificationLog: [],
  playersTurn: "",
  canBid: false,
  latestBid: undefined,
});

const SocketStore = {
  subscribe: socketStore.subscribe,
  set: socketStore.set,
  update: socketStore.update,

  setPlayerInfo: (name: string, roomCode: string) => {
    socketStore.update((self) => {
      self.name = name;
      self.roomCode = roomCode;
      return self;
    });
  },

  addNotification: (notification: Notification) => {
    socketStore.update((self) => {
      self.notificationLog = [...self.notificationLog, notification];
      return self;
    });
  },

  setPlayers: (players: Player[]) => {
    socketStore.update((self) => {
      self.players = players.filter((p) => p.playerName !== self.name);
      return self;
    });
  },

  setPlayersTurn: (playerName: string) => {
    socketStore.update((self) => {
      self.playersTurn = playerName;
      self.canBid = playerName === self.name;
      return self;
    });
  },

  setLatestBid: (bid: Bid) => {
    socketStore.update((self) => {
      self.latestBid = bid;
      return self;
    });
  },

  endOfRound: (dice: EndOfRoundDice[]) => {
    socketStore.update((self) => {
      self.players.map((player) => {
        const _player = dice.find(
          (die) => die.playerName === player.playerName
        );
        player.dice = _player.dice;
      });

      self.canBid = false;
      self.playersTurn = "";

      return self;
    });
  },
};

export default SocketStore;
