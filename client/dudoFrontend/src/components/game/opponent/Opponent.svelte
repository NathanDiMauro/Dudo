<script lang="ts">
  import { ALL_DICE } from "../../../main";
  import SocketStore from "../../../stores/socketStore";
  import disconnectedIcon from "../../../assets/images/disconnected.png";
  import cup from "../../../assets/images/cup.png";
  import type { Player } from "../../../stores/socketStore";
  export let player: Player;
</script>

<div class="mx-2 flex flex-col items-center">
  {#if player.dice}
    {#each player.dice as die}
      <div>
        <img
          class="dieCue h-14 w-14"
          src={ALL_DICE[parseInt(die) - 1]}
          alt={`${player.name}'s cup`}
        />
      </div>
    {/each}
  {/if}
  <div
    class={`m-2 h-28 w-28 bg-felt p-1 text-center ${
      $SocketStore.playersTurn === player.name ? "border-4 border-aqua" : ""
    }`}
  >
    <h3 class="m-0 mb-6 font-bold text-white">
      {player.name}
      {#if player.disconnected}
        <img
          class="mx-1 inline h-3 w-3"
          src={disconnectedIcon}
          alt="disconnected icon"
        />
      {/if}
      <br />
      {player.diceCount}
    </h3>
    <div class="rotate m-auto flex h-16 w-16 bg-light-felt">
      <img class="m-auto h-8 w-8 -rotate-45" src={cup} alt="cup" />
    </div>
  </div>
</div>

<style>
  .rotate {
    transform: rotateY(0deg) rotate(45deg);
  }
</style>
