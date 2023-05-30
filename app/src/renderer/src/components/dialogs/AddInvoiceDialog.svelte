<script lang="ts">
  import FormDialog from "./FormDialog.svelte"
  import { DataService } from "$lib/services/data.service"
  import { Invoice } from "$lib/models/invoice.model"
  import type { Customer } from "$lib/models/customer.model"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { DialogMode } from "$lib/utils/dialog.utils"
  import { createEventDispatcher } from "svelte"

  export let show = false
  export let customer: Customer

  const dispatch = createEventDispatcher<{result: DialogResult}>()

  async function addInvoice(form: HTMLFormElement): Promise<void> {
    let formData = new FormData(form)
    const invoice =  new Invoice()
    invoice.customerId = customer.id
    const rawDate = formData.get("date").toString()
    const date = new Date(Date.parse(rawDate))
    invoice.date = date.toISOString()
    invoice.status = "OPEN"

    const result = DataService.instance().post(`/invoices`, invoice, Invoice)
    if (result) {
      show = false
      dispatch("result", {
        id: null,
        action: "add",
        success: true,
      })
    }
  }
</script>

<FormDialog
  mode={DialogMode.ADD}
  headline="Invoice"
  addCb={addInvoice}
  bind:show={show}
>
  <span class="col-span-4">{customer.firstName} {customer.lastName}</span>
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-4" name="date" type="date" placeholder="Date">
</FormDialog>
