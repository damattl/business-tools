<script lang="ts">
import { calculateTotal } from "$lib/utils/invoice.utils"
import { InvoiceItem } from "$lib/models/invoice-item.model"
import InvoiceItemDialog from "$lib/components/dialogs/InvoiceItemDialog.svelte"
import { Invoice } from "$lib/models/invoice.model"
import type { DialogResult } from "$lib/utils/dialog.utils"
import { DataService } from "$lib/services/data.service"
import { DialogMode } from "$lib/utils/dialog.utils"
import { createEventDispatcher } from "svelte"

export let item: InvoiceItem
export let invoice: Invoice

const dispatchItemUpdate = createEventDispatcher<{update: DialogResult}>()

let showEditDialog = false

async function loadItem(): Promise<InvoiceItem> {
  return DataService.instance()
    .get(`/invoice_items/${item.id}`, InvoiceItem)
    .then(result => result.result)
}
async function handleDialogResult(event: CustomEvent<DialogResult>): Promise<void> {
  if (event.detail.success) {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (event.detail.action === "delete") {
      // TODO: Dispatch
      dispatchItemUpdate("update", event.detail)
      console.log("deleted item")
    } else {
      item = await loadItem()
    }
  }
}

</script>


<tr>
  <td class="text-gray-900 py-2">{item.product.name}</td>
  <td class="py-2">{item.amount}</td>
  <td class="py-2">{!item.customPrice ? item.product.price : item.customPrice + ` (${item.product.price})`}</td>
  <td class="py-2">{calculateTotal(item)}</td>
  <td class="py-2">
    <button class="text-blue-500 hover:text-blue-800" on:click|preventDefault={() => showEditDialog = true}>
      Edit
      <span class="hidden">, Hidden content</span>
    </button>
    <InvoiceItemDialog
      bind:show={showEditDialog}
      on:result={handleDialogResult}
      invoice={invoice}
      item={item}
      mode={DialogMode.EDIT}
    />
  </td>
</tr>
