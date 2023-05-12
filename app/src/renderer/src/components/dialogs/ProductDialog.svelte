<script lang="ts">
  import FormDialog from "$lib/components/dialogs/FormDialog.svelte"
  import { DialogMode } from "$lib/utils/dialog.utils"
  import { Product } from "$lib/models/product.model"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { createEventDispatcher } from "svelte"
  import { DataService } from "$lib/services/data.service"

  export let mode = DialogMode.ADD
  export let show = false
  export let product: Product | null = null

  const dispatch = createEventDispatcher<{result: DialogResult}>()

  function productFromFormData(form: HTMLFormElement): Product {
    let formData = new FormData(form)
    const product = new Product()
    product.name = formData.get("name").toString()
    product.description = formData.get("desc").toString()
    product.price = parseFloat(formData.get("price").toString())

    return product
  }
  async function addProduct(form: HTMLFormElement) {
    let newProduct = productFromFormData(form)

    const result = await DataService.instance().post(`/products`, newProduct, Product)
    if (result) {
      show = false
      dispatch("result", {
        success: true,
        action: "add",
        id: null
      })
    }
  }
  async function updateProduct(form: HTMLFormElement) {
    let update = productFromFormData(form)

    const result = await DataService.instance().post(`/products/${product.id}`, update, Product)
    if (result) {
      show = false
      dispatch("result", {
        success: true,
        action: "edit",
        id: product.id
      })
    }
  }
  async function deleteProduct(form: HTMLFormElement) {
    const result = await DataService.instance().delete(`/products/${product.id}`)
    if (result) {
      show = false
      dispatch("result", {
        success: true,
        action: "delete",
        id: product.id,
      })
    }
  }

</script>

<FormDialog
  mode={mode}
  headline="Product"
  addCb={addProduct}
  updateCb={updateProduct}
  deleteCb={deleteProduct}
  bind:show={show}
>
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-8"
    value={product?.name ?? null}
    name="name"
    type="text"
    placeholder="Product name"
  >
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-8"
    value={product?.price ?? null}
    name="price"
    type="number"
    placeholder="Price"
  >
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-8"
    value={product?.description ?? null}
    name="desc"
    type="text"
    placeholder="Description"
  >
</FormDialog>
