<script lang="ts">
  import Opponents from "./opponent/Opponents.svelte";
  import Player from "./player/Player.svelte";
  import PlayerFooter from "./player/PlayerFooter.svelte";
  import Chat from "./Chat.svelte";
</script>

<div class="flex shrink-0 grow basis-full flex-row">
  <div class="flex basis-3/4 flex-col items-stretch justify-between">
    <Player />
    <Opponents />
    <PlayerFooter />
  </div>
  <div class="flex basis-1/4 flex-col items-stretch justify-end bg-felt">
    <Chat />
  </div>
</div>
