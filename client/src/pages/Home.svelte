<script lang="ts">
  import Game from "../components/game/Game.svelte";
  import Lobby from "../components/pregame/Lobby.svelte";
  import SocketStore from "../stores/socketStore";
</script>

<div class="flex basis-11/12">
  {#if $SocketStore.name === "" || $SocketStore.roomCode === ""}
    <Lobby />
  {:else}
    <Game />
  {/if}
</div>
