<script lang="ts">
  import SocketStore from "../../stores/socketStore";
  import type {
    Bid,
    PlayerEndOfRound,
    Notification,
    Player as PlayerType,
  } from "../../../../shared/types";
  import Chat from "./Chat.svelte";
  import Opponents from "./opponent/Opponents.svelte";
  import Player from "./player/Player.svelte";
  import PlayerFooter from "./player/PlayerFooter.svelte";

  $SocketStore.socket.on("notification", (notification: Notification) => {
    SocketStore.addNotification(notification);
  });

  $SocketStore.socket.on("turn", (playerName: string) => {
    SocketStore.setPlayersTurn(playerName);
  });

  $SocketStore.socket.on("newBid", (bid: { bid: Bid }) => {
    SocketStore.setLatestBid(bid.bid);
  });

  $SocketStore.socket.on(
    "endOfRound",
    (eor: { msg: string; dice: PlayerEndOfRound[] }) => {
      SocketStore.endOfRound(eor.dice);
    }
  );

  $SocketStore.socket.on("endOfGame", (dice) => {
    console.log("end of game");
  });

  $SocketStore.socket.on("players", (players: PlayerType[]) => {
    SocketStore.setPlayers(players);
  });
</script>

<div class="flex shrink-0 grow basis-full flex-row">
  <div class="flex basis-3/4 flex-col items-stretch justify-between">
    <Player />
    <Opponents />
    <PlayerFooter />
  </div>
  <div class="bg-felt flex basis-1/4 flex-col items-stretch justify-end">
    <Chat />
  </div>
</div>
