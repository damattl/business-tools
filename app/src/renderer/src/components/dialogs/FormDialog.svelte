<script lang="ts">
  import { DialogMode } from "$lib/utils/dialog.utils"
  import Dialog from "$lib/components/dialogs/Dialog.svelte"

  export let show = false
  export let headline: string
  export let mode: DialogMode

  export let addCb: ((form: HTMLFormElement) => void) | null = null
  export let updateCb: ((form: HTMLFormElement) => void) | null = null
  export let deleteCb: ((form: HTMLFormElement) => void) | null = null


  let form: HTMLFormElement
</script>


<Dialog bind:show={show}>
  <h2 class="mb-4">{mode === DialogMode.EDIT ? "Edit" : "Add" } {headline}</h2>
  <form bind:this={form} class="grid grid-cols-8 gap-x-2">
    <slot></slot>
    <div class="col-span-4">
      <button on:click|preventDefault={() => {show = false}} class="border w-24 hover:shadow-inner transition-shadow py-1 rounded-lg text-sm mt-2">
        <i class="uil uil-cancel"></i>
        Cancel
      </button>
    </div>
    <div class="col-span-4 col-start-5 gap-2 flex justify-end">
      { #if mode === DialogMode.ADD }
        <button on:click|preventDefault={() => addCb?(form) : null} class="border w-24 hover:shadow-inner transition-shadow py-1 rounded-lg text-sm mt-2">
          <i class="uil uil-plus"></i>
          Add
        </button>
      { /if }
      { #if mode === DialogMode.EDIT }
        <button on:click|preventDefault={() => updateCb?(form) : null} class="border w-24 hover:shadow-inner transition-shadow py-1 rounded-lg text-sm mt-2">
          <i class="uil uil-wrench"></i>
          Edit
        </button>
        {#if deleteCb}
          <button on:click|preventDefault={() => deleteCb(form)} class="border w-24 hover:shadow-inner transition-shadow py-1 rounded-lg text-sm mt-2">
            <i class="uil uil-trash"></i>
            Delete
          </button>
        {/if}
      { /if }
    </div>
  </form>
</Dialog>

