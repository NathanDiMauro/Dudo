<script lang="ts">
  import SocketStore from "../../../stores/socketStore";
  import { ALL_DICE } from "../../../main";
  import type { Bid } from "../../../types/types";

  const defaultBidMsg: string = "It's your turn to bid!";

  let action: string = "";
  let amount: number = 0;
  let dice: number = 0;
  let bidMsg: string = defaultBidMsg;

  const bid = () => {
    let bid: Bid = {
      playerId: $SocketStore.socket.id,
      action: "",
    };
    switch (action) {
      case "raise":
        if (amount == 0 || dice == 0) {
          bidMsg = "Must select amount and dice when raising";
          return;
        }
        bid.amount = amount;
        bid.dice = dice;
        bid.action = "raise";
        if (dice === 1) {
          bid.action = "aces";
        }
        break;
      case "spot":
      case "call":
        bid.action = action;
        bid.amount = null;
        bid.dice = null;
        break;
      default:
        bidMsg = "Must select an action";
        return;
    }

    if (bid.action !== "") {
      $SocketStore.socket.emit("bid", { newBid: bid }, (error) => {
        if (error) {
          bidMsg = error;
          return;
        }

        error = defaultBidMsg;
        action = "";
        amount = 0;
        dice = 0;
      });
    }
  };
</script>

<div class="ml-2 flex basis-1/2 flex-col justify-between rounded bg-felt">
  {#if !$SocketStore.canBid}
    <strong class="m-auto self-center	text-2xl font-bold text-cue"
      >Not your turn to bid</strong
    >
  {:else}
    <div class="mb-2 flex flex-col items-stretch">
      <div
        class="flex flex-row items-center justify-between rounded-t bg-light-felt text-white"
      >
        {#each ["raise", "call", "spot"] as a}
          <button
            class={`r-5 text- m-1 ml-5 rounded bg-dark-felt p-3 text-lg font-bold capitalize transition-all hover:bg-cue
          ${action === a ? "bg-billiards-wood" : ""}`}
            on:click={() => (action = a)}>{a}</button
          >
        {/each}
      </div>
      <div class="bg-cue">
        <h4 class="m-2 text-center font-bold text-white">{bidMsg}</h4>
      </div>
    </div>
    {#if action === "raise"}
      <div class="flex flex-col items-center ">
        <div class="mb-5 flex flex-row items-center rounded bg-cue">
          <p class="basis-2/3 p-2 font-bold text-felt ">
            <label for="amountInput">Amount</label>
          </p>
          <input
            class="h-max basis-1/3 rounded p-2"
            id="amountInput"
            type="number"
            min="1"
            max="99"
            autocomplete="off"
            bind:value={amount}
          />
        </div>
        <div class="flex flex-row content-center items-center text-center">
          {#each ALL_DICE as die, index}
            <button on:click={() => (dice = index + 1)}>
              <img
                class={`dieCue h-14 w-14 ${
                  index + 1 === dice
                    ? "dieCue rounded-lg border-4 border-black"
                    : "dieWhite"
                }`}
                src={die}
                alt={`Dice ${index + 1}`}
              />
              <p>{index + 1}</p>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <div class="flex flex-row justify-between rounded-b bg-light-felt p-1">
      <div class="flex flex-row items-center">
        {#if action !== ""}
          <p>Your bet:</p>
          <h2>
            {#if action === "raise" && amount != 0 && dice != 0}
              {amount} {dice}
            {:else if action === "spot"}
              Calling spot on (get latest bet) (EX: 3 4s)
            {:else if action === "call"}
              Calling (get latest bet) (EX: 3 4s)
            {/if}
          </h2>
        {/if}
      </div>
      <button
        class="rounded border-4 border-dark-felt bg-dark-felt p-2 font-bold text-white hover:border-cue active:bg-billiards-wood"
        on:click={() => bid()}>Make Bet</button
      >
    </div>
  {/if}
</div>

<style>
  .dieCue {
    filter: invert(96%) sepia(10%) saturate(925%) hue-rotate(2deg)
      brightness(90%) contrast(90%);
  }

  .dieWhite {
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(71deg)
      brightness(103%) contrast(101%);
  }
</style>
