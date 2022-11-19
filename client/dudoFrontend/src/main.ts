import App from "./App.svelte";

import dice1 from "./assets/images/dice1.svg";
import dice2 from "./assets/images/dice2.svg";
import dice3 from "./assets/images/dice3.svg";
import dice4 from "./assets/images/dice4.svg";
import dice5 from "./assets/images/dice5.svg";
import dice6 from "./assets/images/dice6.svg";

export const ALL_DICE: string[] = [dice1, dice2, dice3, dice4, dice5, dice6];

export const LOCAL_STORAGE_SOCKET_ID = "socket-id";

export type Bid = {
  playerId: string;
  action: string;
  amount?: number;
  dice?: number;
};

const app = new App({
  target: document.getElementById("app"),
});

export default app;
