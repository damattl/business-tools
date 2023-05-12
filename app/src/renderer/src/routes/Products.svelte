<script lang="ts">
  import { DataService } from "$lib/services/data.service"
  import ProductListItem from "$lib/components/ProductListItem.svelte"
  import { Product } from "$lib/models/product.model"
  import ProductDialog from "$lib/components/dialogs/ProductDialog.svelte"
  import { DialogMode } from "$lib/utils/dialog.utils"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { onMount } from "svelte"

  let products: Product[] = []
  let showDialog = false

  onMount(async () => {
    products = await loadProducts()
  })

  async function loadProducts() {
    return DataService.instance()
      .getList(`/products`, Product)
      .then((result) => result.result)
  }

  async function handleDialogResult(event: CustomEvent<DialogResult>) {
    if (event.detail.success) {
      await new Promise(resolve => setTimeout(resolve, 500))
      products = await loadProducts()
    }
  }

  async function handleProductUpdate(event: CustomEvent<DialogResult>): Promise<void> {
    if (event.detail.success) {
      products = await loadProducts()
    }
  }

</script>

<div class="flex flex-col gap-2 break-all">
  <div class="flex flex-row justify-between my-4">
    <h2>Products</h2>
    <button on:click={() => showDialog = true} class="border hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm">
      <i class="uil uil-plus"></i>
      Add
    </button>
  </div>
  { #each products as product }
    <ProductListItem on:update={handleProductUpdate} product={product} withShadow={true}/>
  {/each}


  <ProductDialog
    mode={DialogMode.ADD}
    on:result={handleDialogResult}
    bind:show={showDialog}
  />
</div>
