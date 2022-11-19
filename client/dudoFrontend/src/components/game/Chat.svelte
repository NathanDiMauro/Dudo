<script lang="ts">
  import SocketStore from "../../stores/socketStore";
  import sendIcon from "../../assets/images/tanSend.png";
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
  <div class="flex min-h-min basis-11/12 flex-col overflow-auto text-white">
    {#each $SocketStore.notificationLog as item}
      <p>
        <strong class="text-lg">{item.title}:</strong>
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
