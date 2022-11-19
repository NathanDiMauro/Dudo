import { writable } from "svelte/store";

const NameStore = writable({
  name: "",
  roomCode: "",
});

export default NameStore;
