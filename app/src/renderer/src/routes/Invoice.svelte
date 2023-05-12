<script lang="ts">
  import { Invoice } from "$lib/models/invoice.model"
  import { DataService } from "$lib/services/data.service"
  import { calculateInvoiceNumber, calculateTotalForInvoice, renderDate } from "../utils/invoice.utils"
  import { Link } from "svelte-routing"
  import InvoiceItemDialog from "$lib/components/dialogs/InvoiceItemDialog.svelte"
  import { onMount } from "svelte"
  import InvoiceItemListItem from "$lib/components/InvoiceItemListItem.svelte"
  import type { DialogResult } from "$lib/utils/dialog.utils"

  export let invoiceId: number

  let showDialog = false
  let invoice: Invoice | undefined

  onMount(async () => {
    invoice = await loadInvoice()
  })

  async function loadInvoice(): Promise<Invoice> {
    return await DataService.instance()
      .get(`/invoices/${invoiceId}`, Invoice)
      .then(result => result.result)
  }

  async function handleDialogMessage(event: CustomEvent<DialogResult>): Promise<void> {
    console.log(event.detail)
    if (event.detail.success) {

      await new Promise(resolve => setTimeout(resolve, 300))
      invoice = await loadInvoice()
    }
  }

  async function handleItemUpdate(event: CustomEvent<DialogResult>): Promise<void> {
    if (event.detail.success) {
      invoice = await loadInvoice()
    }
  }
</script>

{#if invoice}
  <div class="p-6 shadow rounded-xl box-border">
    <div class="px-4 sm:px-0">
      <h3 class="text-base font-semibold leading-7 text-gray-900">Invoice {calculateInvoiceNumber(invoice)}</h3>
      <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{renderDate(invoice.date)}</p>
    </div>
    <div class="mt-6 border-t border-gray-100">
      <dl class="divide-y divide-gray-100">
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Total</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{calculateTotalForInvoice(invoice)} EUR</dd>
        </div>
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Customer</dt>
          <Link to="/customers/{invoice.customerId}">
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {invoice.customer.firstName} {invoice.customer.lastName}
              {#if invoice.customer.company && invoice.customer.company !== ""}
                @{invoice.customer.company}
              {/if}
            </dd>
          </Link>
        </div>
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Billing Address</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {invoice.customer.address.street} {invoice.customer.address.streetNr},
            {invoice.customer.address.postalCode} {invoice.customer.address.city}
          </dd>
        </div>

        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Items</dt>
          <dd class="mt-2 text-sm text-gray-500 sm:col-span-3 sm:mt-0 text-left">
            <table class="w-full">
              <thead class="uppercase border-b">
              <tr>
                <th scope="col" class="py-2 text-xs font-medium text-gray-500">Product</th>
                <th scope="col" class="py-2 text-xs font-medium text-gray-500">Amount</th>
                <th scope="col" class="py-2 text-xs font-medium text-gray-500">Price</th>
                <th scope="col" class="py-2 text-xs font-medium text-gray-500">Total</th>
                <th scope="col" class="py-2 text-xs font-medium text-gray-500">
                  <span class="hidden">Edit</span>
                </th>
              </tr>
              </thead>
              <tbody>
              {#each invoice.invoiceItems as item}
                <InvoiceItemListItem on:update={handleItemUpdate} invoice={invoice} item={item}/>
              {/each}
              </tbody>
            </table>
          </dd>
        </div>
      </dl>
      <button class="border hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm" on:click={() => {showDialog = true}}>
        <i class="uil uil-plus"></i>
        Add Item
      </button>
      <InvoiceItemDialog
        bind:show={showDialog}
        on:result={handleDialogMessage}
        invoice={invoice}
      />
    </div>

  </div>

{/if}

