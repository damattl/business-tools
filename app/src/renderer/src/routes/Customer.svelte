<script lang="ts">
  import { DataService } from "$lib/services/data.service"
  import { Customer } from "$lib/models/customer.model"
  import InvoiceListItem from "$lib/components/InvoiceListItem.svelte"
  import AddInvoiceDialog from "$lib/components/dialogs/AddInvoiceDialog.svelte"
  import CustomerDialog from "$lib/components/dialogs/CustomerDialog.svelte"
  import { onMount } from "svelte"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { DialogMode } from "$lib/utils/dialog.utils"
  import BackButton from "$lib/components/BackButton.svelte"

  export let customerId: number

  let showInvoiceDialog = false
  let showCustomerDialog = false

  let customer: Customer | null = null

  onMount(async () => {
    customer = await loadCustomer()
  })

  $: openInvoices = customer?.invoices.filter(i => i.status === "OPEN")
  $: pendingInvoices = customer?.invoices.filter(i => i.status === "PENDING")
  $: closedInvoices = customer?.invoices.filter(i => i.status === "CLOSED")

  async function loadCustomer(): Promise<Customer> {
    return DataService.instance()
      .get(`/customers/${customerId}`, Customer)
      .then(result => result.result)
  }

  // TODO: Differentiate between Added Invoice and Edited Customer
  async function handleDialogResult(event: CustomEvent<DialogResult>): Promise<void> {
    if (event.detail.success) {
      await new Promise(resolve => setTimeout(resolve, 500))
      customer = await loadCustomer()
    }
  }

</script>

{#if customer}
  <BackButton/>
  <div class="p-6 box-border shadow rounded-xl">
    <div class="flex flex-row">
      <div class="px-4 sm:px-0 flex-grow">
        <h3 class="text-base font-semibold leading-7 text-gray-900">{customer.title ?? ''} {customer.firstName} {customer.lastName}</h3>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and invoices.</p>
      </div>
      <div>
        <button on:click={() => {showCustomerDialog = true}} class="text-blue-500 hover:text-blue-800">Edit<span class="hidden">, Hidden content</span></button>
      </div>
    </div>
    <div class="mt-6 border-t border-gray-100">
      <dl class="divide-y divide-gray-100">
        {#if customer.title}
          <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">Title</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.title}</dd>
          </div>
        {/if}
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">First name</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.firstName}</dd>
        </div>
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Last name</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.lastName}</dd>
        </div>
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Company</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.company}</dd>
        </div>
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Email address</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.mail ?? ""}</dd>
        </div>
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Phone</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.phone ?? ""}</dd>
        </div>
        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Address</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {customer.address.street} {customer.address.streetNr}, {customer.address.postalCode} {customer.address.city}
          </dd>
        </div>

        {#if openInvoices && openInvoices.length !== 0 }
          <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">Open Invoices</dt>
            <dd class="mt-2 text-sm text-gray-900 sm:col-span-3 lg:col-span-2 sm:mt-0">
              <ul class="divide-y divide-gray-100 rounded-md border border-gray-200">
                {#each openInvoices as invoice}
                  <InvoiceListItem invoice={invoice}/>
                {/each}
              </ul>
            </dd>
          </div>
        {/if}

        {#if pendingInvoices && pendingInvoices.length !== 0 }
          <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">Pending Invoices</dt>
            <dd class="mt-2 text-sm text-gray-900 sm:col-span-3 lg:col-span-2 sm:mt-0">
              <ul class="divide-y divide-gray-100 rounded-md border border-gray-200">
                {#each pendingInvoices as invoice}
                  <InvoiceListItem invoice={invoice}/>
                {/each}
              </ul>
            </dd>
          </div>
        {/if}

        {#if closedInvoices && closedInvoices.length !== 0 }
          <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">Closed Invoices</dt>
            <dd class="mt-2 text-sm text-gray-900 sm:col-span-3 lg:col-span-2 sm:mt-0">
              <ul class="divide-y divide-gray-100 rounded-md border border-gray-200">
                {#each closedInvoices as invoice}
                  <InvoiceListItem invoice={invoice}/>
                {/each}
              </ul>
            </dd>
          </div>
        {/if}

      </dl>
      <button class="border hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm" on:click={() => {showInvoiceDialog = true}}>
        <i class="uil uil-plus"></i>
        Add Invoice
      </button>
      <AddInvoiceDialog
        on:result={handleDialogResult}
        bind:show={showInvoiceDialog}
        customer={customer}
      />
      <CustomerDialog
        on:result={handleDialogResult}
        bind:show={showCustomerDialog}
        customer={customer}
        mode={DialogMode.EDIT}
      />
    </div>
  </div>
{/if}
