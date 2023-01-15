<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import About from "./pages/About.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Home from "./pages/Home.svelte";
  import SocketStore from "./stores/socketStore";
  import { onDestroy, onMount } from "svelte";
  import { LOCAL_STORAGE_SOCKET_ID } from "./main";

  // Socket life cycle events.

  // On destroy, save the socket ID to local storage so we can use it when attempting to reconnect.
  onDestroy(() => {
    let id = $SocketStore.socket.id;

    if (id === undefined || id === null) {
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_SOCKET_ID, id);
  });

  // On mount, see if we should reconnect.
  onMount(() => {
    const prevSocketId = localStorage.getItem(LOCAL_STORAGE_SOCKET_ID);
    if (prevSocketId === null || prevSocketId === undefined) return;

    $SocketStore.socket.emit("reconnect", { socketId: prevSocketId }, (res) => {
      console.log(res);
      if (res.error) {
        console.error(res.error);
      } else {
        SocketStore.update((old) => {
          old.name = res.name;
          old.roomCode = res.roomCode;
          return old;
        });

        // Append a message in the chat (for this user only), that they reconnected.
        SocketStore.addNotification({
          title: "You have reconnected",
          description: undefined,
        });

        localStorage.setItem(LOCAL_STORAGE_SOCKET_ID, $SocketStore.socket.id);
      }
    });
  });
</script>

<Router>
  <main class="m-0 flex h-screen justify-center bg-dark-felt p-0">
    <div class="flex basis-full flex-col">
      <Navbar />
      <Route path="/"><Home /></Route>
      <Route path="about"><About /></Route>
    </div>
  </main>
</Router>

<style global lang="postcss">
  @tailwind utilities;
  @tailwind components;
  @tailwind base;
</style>
