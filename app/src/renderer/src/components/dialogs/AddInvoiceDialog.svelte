<script lang="ts">
  import Dialog from "./Dialog.svelte"
  import { DataService } from "$lib/services/data.service"
  import { Invoice } from "$lib/models/invoice.model"
  import type { Customer } from "$lib/models/customer.model"

  export let show = false
  export let customer: Customer

  let form: HTMLFormElement
  let dateInput: HTMLFormElement


  async function addInvoice(): Promise<void> {
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

<Dialog bind:show={show}>
  <h2 class="mb-4">Add Invoice</h2>
  <form bind:this={form} class="grid grid-cols-8 gap-x-2">
    <span class="col-span-4">{customer.firstName} {customer.lastName}</span>
    <input class="border rounded-lg px-2 py-1 mb-2 col-span-4" name="date" type="date" placeholder="Date">

    <div class="col-span-4">
      <button on:click|preventDefault={() => {show = false}} class="border w-24 hover:shadow-inner transition-shadow py-1 rounded-lg text-sm mt-2">
        <i class="uil uil-cancel"></i>
        Cancel
      </button>
    </div>
    <div class="col-span-4 col-start-5 flex justify-end">
      <button on:click|preventDefault={addInvoice} class="border w-24 hover:shadow-inner transition-shadow py-1 rounded-lg text-sm mt-2">
        <i class="uil uil-plus"></i>
        Add
      </button>
    </div>
  </form>
</Dialog>
