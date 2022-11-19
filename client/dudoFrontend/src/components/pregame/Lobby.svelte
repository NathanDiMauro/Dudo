<script lang="ts">
  import Host from "./Host.svelte";
  import Join from "./Join.svelte";
</script>

<div class="flex basis-full flex-col self-center text-white">
  <Host />
  <hr class="my-8 mx-auto h-1 w-1/2 self-center rounded-lg border-0 bg-cue" />
  <Join />
</div>
