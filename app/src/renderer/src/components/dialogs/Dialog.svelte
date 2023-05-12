<script lang="ts">
  import { clickOutside } from "$lib/utils/dialog.utils"

  export let show = false

</script>

{#if show}
  <div class="bg-opacity-50 bg-black fixed right-0 top-0 bottom-0 w-full flex justify-center items-center">
    <div use:clickOutside on:outclick={() => show = false} class="w-2/3 bg-white rounded-xl shadow-xl p-8">
      <slot></slot>
    </div>
  </div>

{/if}
