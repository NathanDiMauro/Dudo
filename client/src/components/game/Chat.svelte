<script lang="ts">
  import sendIcon from "../../assets/images/tanSend.png";
  import SocketStore from "../../stores/socketStore";
  let message: string = "";

  const sendMessage = () => {
    if (message === "") {
      return;
    }
    $SocketStore.socket.emit("sendMessage", { message: message }, (error) => {
      if (error) {
        console.log(error);
      } else {
        message = "";
      }
    });
  };
</script>

<div
  class="mb-1 flex flex-col justify-end overflow-auto rounded border-none p-1"
>
  <div
    class="flex min-h-min basis-11/12 flex-col content-center overflow-auto text-white"
  >
    {#each $SocketStore.notificationLog as item}
      <p>
        <!-- Need this funky if checks to display the message correctly /: -->
        <strong class="text-lg">
          {#if item.title == $SocketStore.name}
            <span class="text-cue">{item.title} (you):</span>
          {:else if item.description}
            {item.title}:
          {:else}
            {item.title}
          {/if}
        </strong>
        <small>
          {#if item.description}
            {item.description}
          {/if}
        </small>
      </p>
    {/each}
  </div>
  <form
    class="flex basis-1/12 flex-row"
    on:submit|preventDefault={() => sendMessage()}
  >
    <input
      class="m-1 basis-11/12 rounded border-none"
      type="text"
      bind:value={message}
    />
    <button
      class="m-1 basis-1/12 rounded border-2 p-0.5 hover:bg-billiards-wood"
      type="submit"
    >
      <img src={sendIcon} alt="Send" />
    </button>
  </form>
</div>
