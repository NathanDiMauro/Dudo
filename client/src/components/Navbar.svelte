<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<nav class="flex basis-1/12 flex-row items-center justify-between bg-felt px-5">
  <Link to="/">
    <h3 class="body-font text-4xl font-bold text-white">Dudo - Online</h3>
  </Link>
  <Link to="about">
    <h3 class="text-xl font-semibold text-white">About</h3>
  </Link>
</nav>
