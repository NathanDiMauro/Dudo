<script lang="ts">
  import SocketStore from "../../stores/socketStore";

  let name: string;

  const handleClick = () => {
    if (!name) {
      return;
    }
    const roomCode = Math.floor(Math.random() * 9999);

    // Emit socket event to create a new room.
    $SocketStore.socket.emit(
      "createRoom",
      { name: name, roomCode: roomCode },
      (error) => {
        if (error) {
          console.log(error);
          alert(error);
          return;
        }

        // On success, update the name and room code in context.
        SocketStore.setPlayerInfo(name, roomCode.toString());
      }
    );
  };
</script>

<div class="flex basis-4/12 flex-col items-center">
  <h2 class="my-8 basis-1/2 text-2xl font-bold">Host Game</h2>
  <div class="flex basis-1/2 flex-row">
    <input
      class="placeholder:text-slate- placeholder: placeholder:bold mx-3 rounded p-2 text-slate-800 placeholder:text-sm"
      type="text"
      id="nameInput"
      placeholder="Name"
      autoComplete="off"
      bind:value={name}
    />
    <button
      class="rounded border-2 border-felt bg-felt px-2 py-1 hover:border-cue active:bg-dark-felt"
      on:click={handleClick}
    >
      Host
    </button>
  </div>
</div>
