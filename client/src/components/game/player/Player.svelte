<script lang="ts">
  import Hand from "./Hand.svelte";
  import PlayerActions from "./PlayerActions.svelte";
  import CurrentBid from "./CurrentBid.svelte";
</script>

<div class="mx-3 mt-2 flex grow basis-2/6 flex-row justify-between">
  <div
    class="bg-felt mr-2 flex basis-1/2 flex-col justify-between rounded text-center"
  >
    <CurrentBid />
    <hr class="bg-cue mx-auto h-1 w-full self-center border-0" />

    <Hand />
  </div>
  <PlayerActions />
</div>
