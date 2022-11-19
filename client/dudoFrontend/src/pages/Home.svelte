<script lang="ts">
  import SocketStore from "../stores/socketStore";
  import Lobby from "../components/pregame/Lobby.svelte";
  import Game from "../components/game/Game.svelte";
</script>

<div class="flex basis-11/12">
  {#if $SocketStore.name === "" || $SocketStore.roomCode === ""}
    <Lobby />
  {:else}
    <Game />
  {/if}
</div>
