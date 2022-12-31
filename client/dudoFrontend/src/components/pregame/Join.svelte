<script lang="ts">
  import SocketStore from "../../stores/socketStore";

  let name: string, roomCode: string;

  const handleClick = () => {
    if (!name || !roomCode) {
      return;
    }

    // Emit socket event to join a room.
    $SocketStore.socket.emit(
      "join",
      { name: name, roomCode: parseInt(roomCode) },
      (error) => {
        if (error) {
          console.log(error);
          alert(error);
          return;
        }

        // On success, update the name and room code in context.
        SocketStore.setPlayerInfo(name, roomCode);
      }
    );
  };
</script>

<div class="flex basis-4/12 flex-col items-center">
  <h2 class="mb-8 basis-1/2 text-2xl font-bold">Join Game</h2>
  <div class="basis 1/2 flex flex-row">
    <input
      class="placeholder:text-slate- placeholder: placeholder:bold mx-3 rounded p-2 text-slate-800 placeholder:text-sm"
      type="text"
      id="nameInput"
      placeholder="Name"
      autoComplete="off"
      bind:value={name}
    />
    <input
      class="placeholder:text-slate- placeholder: placeholder:bold mx-3 rounded p-2 text-slate-800 placeholder:text-sm"
      type="text"
      id="nameInput"
      placeholder="Room Code"
      autoComplete="off"
      bind:value={roomCode}
    />
    <button
      class="rounded border-2 border-felt bg-felt px-2 py-1 hover:border-cue active:bg-dark-felt"
      on:click={handleClick}
    >
      Join
    </button>
  </div>
</div>
