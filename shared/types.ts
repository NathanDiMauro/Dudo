export type Player = {
  id: string;
  playerName: string;
  disconnected: boolean;
  diceCount: number;
  dice: number[];
};

export type PlayerBrief = {
  playerName: string;
  diceCount: number;
};

export type Bid = {
  playerId: string;
  action: string;
  amount?: number;
  dice?: number;
};

export type EndOfRound = {
  msg: string;
  players: { playerName: string; dice: number[] }[];
};

export type Notification = {
  title: string;
  description: string;
};

export type Error = {
  //   ok: boolean;
  msg: string;
};
