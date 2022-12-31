<script lang="ts">
  import SocketStore from "../../../stores/socketStore";
  import Opponent from "./Opponent.svelte";
</script>

<div
  class="relative m-3 my-12 flex basis-3/6 place-items-center justify-center rounded-full"
>
  {#each $SocketStore.players as player}
    <Opponent {player} />
  {/each}
</div>
