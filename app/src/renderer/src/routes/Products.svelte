<script lang="ts">
  import { DataService } from "$lib/services/data.service"
  import ProductListItem from "$lib/components/ProductListItem.svelte"
  import { Product } from "$lib/models/product.model"
  import ProductDialog from "$lib/components/dialogs/ProductDialog.svelte"
  import { DialogMode } from "$lib/utils/dialog.utils"

  let products: Product[] = []
  DataService.instance()
    .getList(`/products`, Product)
    .then((result) => {
      products = result.result
    })

  let showDialog = false

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
    <ProductListItem product={product} withShadow={true}/>
  {/each}


  <ProductDialog
    mode={DialogMode.ADD}
    bind:show={showDialog}
  />
</div>
