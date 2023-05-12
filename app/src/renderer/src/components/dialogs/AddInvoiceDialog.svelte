<script lang="ts">
  import FormDialog from "./FormDialog.svelte"
  import { DataService } from "$lib/services/data.service"
  import { Invoice } from "$lib/models/invoice.model"
  import type { Customer } from "$lib/models/customer.model"
  import { DialogMode } from "$lib/utils/dialog.utils"

  export let show = false
  export let customer: Customer



  async function addInvoice(form: HTMLFormElement): Promise<void> {
    let formData = new FormData(form)
    const invoice =  new Invoice()
    invoice.customerId = customer.id
    const rawDate = formData.get("date").toString()
    const date = new Date(Date.parse(rawDate))
    invoice.date = date.toISOString()

    const result = DataService.instance().post(`/invoices`, invoice, Invoice)
    if (result) {
      show = false
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
