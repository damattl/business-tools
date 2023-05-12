<script lang="ts">
  import type { Product } from "../models/product.model"
  import { Link } from "svelte-routing"

  export let product: Product
  export let withShadow = false
</script>

<Link class="w-full break-all" to="/products/{product.id}">
  <li class="flex items-center justify-between w-full {withShadow ? 'shadow' : ''} rounded-lg py-4 pl-4 pr-5 text-sm leading-6">
    <div class="flex w-0 flex-1 items-center">
      <i class="uil uil-atom text-lg text-gray-500"></i>
      <div class="ml-4 flex min-w-0 flex-1 gap-3">
        <div class="flex flex-1">
          <span class="truncate font-medium">
          {product.name}
          </span>
          <span class="flex-shrink-0 text-gray-400">{product.description}</span>
        </div>
        <span class="flex-shrink-0 text-gray-400">Price: {product.price}</span>
      </div>
    </div>
  </li>
</Link>
