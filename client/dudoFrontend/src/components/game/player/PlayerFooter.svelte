<script lang="ts">
  import { LOCAL_STORAGE_SOCKET_ID } from "../../../main";
  import SocketStore from "../../../stores/socketStore";
  $: canStartGame = true;

  const startRound = () => {
    if (!canStartGame) {
      return;
    }

    $SocketStore.socket.emit("startGame", (error) => {
      if (error) canStartGame = false;
    });
  };

  $: if (!canStartGame) {
    setTimeout(() => (canStartGame = true), 5 * 1000);
  }

  const leaveGame = () => {
    localStorage.setItem(LOCAL_STORAGE_SOCKET_ID, null);
    $SocketStore.socket.disconnect();
    SocketStore.update((old) => {
      old.name = "";
      old.roomCode = "";
      return old;
    });
  };
</script>

<div class="flex flex-row items-center justify-between bg-felt p-2 text-white">
  <div class="flex flex-row">
    <div class="ml-2 mr-10 flex flex-col items-center justify-center">
      <h3 class="text-lg font-bold">{$SocketStore.roomCode}</h3>
      <p class="text-sm italic">Room</p>
    </div>
    <div class="ml-2 mr-10 flex flex-col items-center justify-center">
      <h3 class="text-lg font-bold">{$SocketStore.name}</h3>
      <p class="text-sm italic">Name</p>
    </div>
  </div>
  <div class="mr-3 flex flex-row">
    <div class="flex flex-row content-start items-center">
      <button
        class="mx-2 rounded border-4 border-light-felt bg-light-felt p-2 font-semibold hover:border-cue active:bg-dark-felt"
        on:click={() => startRound()}
      >
        {#if canStartGame === true}
          Start Round
        {:else}
          <span class="font-semibold text-orange-300">Round in progress</span>
        {/if}
      </button>
      <button
        class="mx-2 rounded border-4 border-red-500 bg-red-500 p-2 font-semibold hover:border-red-700 active:bg-red-900 "
        on:click={() => leaveGame()}
        >Leave game
      </button>
    </div>
  </div>
</div>
