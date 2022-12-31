<script lang="ts">
  import SocketStore from "../../../stores/socketStore";
</script>

<div class="flex basis-1/2 flex-col justify-center">
  <div class="m-auto flex basis-3/4 items-center">
    <h2 class="text-2xl font-bold text-cue">
      {#if $SocketStore.latestBid != undefined}
        <span class="text-4xl">
          {$SocketStore.latestBid.amount}
          {$SocketStore.latestBid.dice}s
        </span>
      {:else}
        No bid has been made yet
      {/if}
    </h2>
  </div>
  <div class="basis-1/4 rounded-t bg-light-felt p-1 font-bold text-white">
    <h2>Current Bet</h2>
  </div>
</div>
