<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import About from "./pages/About.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Home from "./pages/Home.svelte";
  import SocketStore from "./stores/socketStore";
  import { onDestroy, onMount } from "svelte";
  import { LOCAL_STORAGE_SOCKET_ID } from "./main";
  import type { Error } from "../../shared/types";
  import type { ReconnectResponse } from "../../shared/socket";

  // Socket life cycle events.

  // Save the socket ID to local storage so we can use it when attempting to reconnect.
  onDestroy(() => {
    let id = $SocketStore.socket.id;

    if (id === undefined || id === null) {
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_SOCKET_ID, id);
  });

  // See if we should reconnect.
  onMount(() => {
    const prevSocketId = localStorage.getItem(LOCAL_STORAGE_SOCKET_ID);
    if (prevSocketId === null || prevSocketId === undefined) return;

    $SocketStore.socket.emit(
      "reconnect",
      prevSocketId,
      (resp: ReconnectResponse) => {
        if (resp.Error) {
          console.error(resp.Error.msg);
          localStorage.removeItem(LOCAL_STORAGE_SOCKET_ID);
          SocketStore.reset();
          return;
        } else if (!resp.PlayerName && !resp.RoomCode) {
          console.error("No error and also no player info.");
          return;
        }

        SocketStore.update((old) => {
          old.name = resp.PlayerName;
          old.roomCode = resp.RoomCode;
          return old;
        });

        // Append a message in the chat (for this user only) that they reconnected.
        SocketStore.addNotification({
          title: "You have reconnected",
          description: undefined,
        });

        localStorage.setItem(LOCAL_STORAGE_SOCKET_ID, $SocketStore.socket.id);
      }
    );
  });
</script>

<Router>
  <main class="bg-dark-felt m-0 flex h-screen justify-center p-0">
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
