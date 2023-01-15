export type Player = {
  playerName: string;
  disconnected: boolean;
  dicCount: number;
  dice?: number[];
};

export type Bid = {
  playerId: string;
  action: string;
  amount?: number;
  dice?: number;
};

export type EndOfRoundDice = {
  playerName: string;
  dice: number[];
};

export type Notification = {
  title: string;
  description: string;
};

export type Error = {
  ok: boolean;
  msg: string;
};
