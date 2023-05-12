<script lang="ts">
  import type { Product } from "$lib/models/product.model"
  import ProductDialog from "$lib/components/dialogs/ProductDialog.svelte"
  import { DialogMode } from "$lib/utils/dialog.utils"

  export let product: Product
  export let withShadow = false

  let showEditDialog = false
</script>

<li class="flex break-all items-center justify-between w-full {withShadow ? 'shadow' : ''} rounded-lg py-4 pl-4 pr-5 text-sm leading-6">
  <div class="flex w-0 flex-1 items-center">
    <i class="uil uil-atom text-lg text-gray-500"></i>
    <div class="ml-4 flex min-w-0 flex-1 gap-3">
      <div class="flex flex-1 gap-2">
        <span class="truncate font-medium">{product.name}</span>
        <span class="flex-shrink-0 text-gray-400">{product.description}</span>
        <span class="flex-shrink-0 text-gray-400">Price: {product.price}</span>
      </div>

      <button class="text-blue-500 hover:text-blue-800" on:click|preventDefault={() => showEditDialog = true}>
        Edit
      </button>

      <ProductDialog
        mode={DialogMode.EDIT}
        product={product}
        bind:show={showEditDialog}
      />
    </div>
  </div>
</li>
