<script lang="ts">
  import cup from "../../../assets/images/cup.png";
  import disconnectedIcon from "../../../assets/images/disconnected.png";
  import { ALL_DICE } from "../../../main";
  import SocketStore from "../../../stores/socketStore";
  import type { Player } from "../../../../../shared/types";
  export let player: Player;

  const borderColor = (opponent: Player): string => {
    if (opponent.playerName === $SocketStore.playersTurn) {
      return "light-felt";
    }
    if (opponent.playerName === $SocketStore.name) {
      return "cue";
    }

    return "felt";
  };
</script>

<div class="mx-2 flex flex-col items-center">
  {#if player.dice}
    <div class="flex flex-row">
      {#each player.dice as die}
        <div>
          <img
            class="dieCue h-6 w-6"
            src={ALL_DICE[die - 1]}
            alt={`${player.playerName}'s cup`}
          />
        </div>
      {/each}
    </div>
  {/if}
  <div
    class={`bg-felt m-2 h-28 w-28 border-8 p-1 text-center border-${borderColor(
      player
    )}`}
  >
    <h3 class="m-0 mb-6 font-bold text-white">
      {player.playerName}
      {#if player.playerName === $SocketStore.name}
        <span class="text-sm font-light">(you)</span>
      {/if}
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
    <div class="rotate bg-light-felt m-auto flex h-16 w-16">
      <img class="m-auto h-8 w-8 -rotate-45" src={cup} alt="cup" />
    </div>
  </div>
</div>

<style>
  .rotate {
    transform: rotateY(0deg) rotate(45deg);
  }
  .dieCue {
    filter: invert(96%) sepia(10%) saturate(925%) hue-rotate(2deg)
      brightness(90%) contrast(90%);
  }
</style>
