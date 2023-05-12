<script lang="ts">
  import FormDialog from "./FormDialog.svelte"
  import { DataService } from "$lib/services/data.service"
  import { Invoice } from "$lib/models/invoice.model"
  import { calculateInvoiceNumber } from "$lib/utils/invoice.utils"
  import { Product } from "$lib/models/product.model"
  import { InvoiceItem } from "$lib/models/invoice-item.model"
  import { createEventDispatcher, onMount } from "svelte"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { DialogMode } from "$lib/utils/dialog.utils"

  export let show = false
  export let invoice: Invoice
  export let item: InvoiceItem | null = null

  export let mode: DialogMode = DialogMode.ADD

  const dispatch = createEventDispatcher<{result: DialogResult}>()

  let products: Product[] = []

  onMount(async () => {
    products = await loadProducts()
  })

  function invoiceItemFromFormData(form: HTMLFormElement): InvoiceItem {
    let formData = new FormData(form)
    const item = new InvoiceItem()
    item.invoiceId = invoice.id
    item.amount = parseInt(formData.get("amount").toString())
    item.customPrice = parseFloat(formData.get("customPrice").toString())
    item.productId = parseInt(formData.get("productId").toString())
    item.description = formData.get("desc").toString()

    return item
  }

  async function loadProducts(): Promise<Product[]> {
    return await DataService.instance().getList(`/products`, Product)
      .then(result => result.result)
  }

  async function addInvoiceItem(form: HTMLFormElement): Promise<void> {
    let newItem = invoiceItemFromFormData(form)

    const result = await DataService.instance().post(`/invoice_items`, newItem, InvoiceItem)
    if (result) {
      show = false
      dispatch("result", {
        success: true,
        action: "add",
        id: null,
      })
    }
  }

  async function editInvoiceItem(form: HTMLFormElement): Promise<void> {
    const update = invoiceItemFromFormData(form)

    const result = await DataService.instance().post(`/invoice_items/${item.id}`, update, InvoiceItem)
    if (result) {
      show = false
      dispatch("result", {
        success: true,
        action: "edit",
        id: item.id,
      })
    }
  }

  async function deleteInvoiceItem(form: HTMLFormElement): Promise<void> {
    const result = await DataService.instance().delete(`/invoice_items/${item.id}`)
    if (result) {
      show = false
      dispatch("result", {
        success: true,
        action: "delete",
        id: item.id,
      })
    }
  }
</script>


<FormDialog
  mode={mode}
  headline="Invoice Item"
  addCb={addInvoiceItem}
  updateCb={editInvoiceItem}
  deleteCb={deleteInvoiceItem}
  bind:show={show}
>
  <select value={item?.productId ?? products[0]?.id} class="border rounded-lg px-2 py-1 mb-2 col-span-4" name="productId">
    {#each products as product}
      <option value={product.id}>{product.name}</option>
    {/each}
  </select>
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-4" value={item?.amount ?? null} name="amount" type="number" placeholder="Amount">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-4" value={item?.customPrice ?? null} name="customPrice" type="number" placeholder="Custom Price">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-4" value={item?.description ?? null} name="desc" type="text" placeholder="Description">

</FormDialog>
