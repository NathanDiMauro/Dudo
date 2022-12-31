<script lang="ts">
  import { ALL_DICE } from "../../../main";
  import SocketStore from "../../../stores/socketStore";

  let hand: string[] = ALL_DICE;

  $SocketStore.socket.on("diceForRound", (dice) => {
    hand = dice.dice.map((die) => ALL_DICE[die - 1]);
  });
</script>

<div class="flex basis-1/2 flex-col justify-between rounded text-white">
  <div class="rounded-b bg-light-felt p-1 font-bold"><h2>Your Hand</h2></div>
  <div class="flex flex-row self-center p-5">
    {#if hand.length > 0}
      {#each hand as die, index}
        <div>
          <img class="dieCue h-14 w-14" src={die} alt={`Dice ${index + 1}`} />
          <p class="m-0 p-0 text-sm text-cue">{index + 1}</p>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .dieCue {
    filter: invert(96%) sepia(10%) saturate(925%) hue-rotate(2deg)
      brightness(90%) contrast(90%);
  }
</style>
