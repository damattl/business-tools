<script lang="ts">
  import { DataService } from "$lib/services/data.service"
  import ProductListItem from "$lib/components/ProductListItem.svelte"
  import { Product } from "$lib/models/product.model"

  let products: Product[] = []
  DataService.instance()
    .getList(`/products`, Product)
    .then((result) => {
      products = result.result
    })

</script>

<div class="flex flex-col gap-2 break-all">
  { #each products as product }
    <ProductListItem product={product} withShadow={true}/>
  {/each}

</div>
