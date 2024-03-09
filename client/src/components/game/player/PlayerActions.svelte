<script lang="ts">
  import SocketStore from "../../../stores/socketStore";
  import { ALL_DICE } from "../../../main";
  import type { Bid } from "../../../../../shared/types";

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
      $SocketStore.socket.emit("bid", bid, (resp) => {
        if (resp.Error) {
          bidMsg = resp.Error.msg;
          return;
        }

        // TODO what's going on here?
        action = "";
        amount = 0;
        dice = 0;
      });
    }
  };
</script>

<div class="bg-felt ml-2 flex basis-1/2 flex-col justify-between rounded">
  {#if !$SocketStore.canBid}
    <strong class="text-cue m-auto	self-center text-2xl font-bold"
      >Not your turn to bid</strong
    >
  {:else}
    <div class="mb-2 flex flex-col items-stretch">
      <div
        class="bg-light-felt flex flex-row items-center justify-between rounded-t text-white"
      >
        {#each ["raise", "call", "spot"] as a}
          <button
            class={`r-5 text- bg-dark-felt hover:bg-cue m-1 ml-5 rounded p-3 text-lg font-bold capitalize transition-all
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
        <div class="bg-cue mb-5 flex flex-row items-center rounded">
          <p class="text-felt basis-2/3 p-2 font-bold ">
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

    <div class="bg-light-felt flex flex-row justify-between rounded-b p-1">
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
        class="border-dark-felt bg-dark-felt hover:border-cue active:bg-billiards-wood rounded border-4 p-2 font-bold text-white"
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
