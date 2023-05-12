<script lang="ts">
  import { Product } from "$lib/models/product.model"
  import ProductDialog from "$lib/components/dialogs/ProductDialog.svelte"
  import { DialogMode } from "$lib/utils/dialog.utils"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { createEventDispatcher } from "svelte"
  import { DataService } from "$lib/services/data.service"

  export let product: Product
  export let withShadow = false
  let showEditDialog = false

  const dispatchProductUpdate = createEventDispatcher<{update: DialogResult}>()
  async function loadProduct(): Promise<Product> {
    return await DataService.instance()
      .get(`/products/${product.id}`, Product)
      .then((result) => result.result)
  }


  async function handleDialogResult(event: CustomEvent<DialogResult>): Promise<void> {
    if (event.detail.success) {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (event.detail.action === "delete") {
        // TODO: Dispatch
        dispatchProductUpdate("update", event.detail)
      } else {
        product = await loadProduct()
      }
    }
  }
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
        on:result={handleDialogResult}
        bind:show={showEditDialog}
      />
    </div>
  </div>
</li>
