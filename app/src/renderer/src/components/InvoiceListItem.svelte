<script lang="ts">
  import { calculateInvoiceNumber, calculateTotalForInvoice, renderDate } from "../utils/invoice.utils"
  import { Link } from "svelte-routing"
  import { Invoice } from "$lib/models/invoice.model"
  import { DataService } from "$lib/services/data.service"
  import { renderInvoice } from "$lib/utils/render.utils"
  import { tick } from "svelte"

  export let invoice: Invoice
  export let withShadow = false

  let hiddenDownload: HTMLAnchorElement | undefined
  let fileURL: string | undefined
  async function handleDownload(id: number): Promise<void> {
    const result = await DataService.instance().get(`/invoices/${id}`, Invoice)
    const renderResponse = await renderInvoice(result.result)
    if (renderResponse.ok) {
      const blob = await renderResponse.blob()
      fileURL = URL.createObjectURL(blob)
      await tick()
      hiddenDownload.click()
    }
  }
</script>

<li class="flex items-center justify-between {withShadow ? 'shadow' : ''} rounded-lg py-4 pl-4 pr-5 text-sm leading-6 w-full">
  <Link to="/invoices/{invoice.id}">
    <div class="flex flex-1 items-center">
      <i class="uil uil-invoice text-xl mx-2 text-gray-600"></i>

      <div class="ml-4 flex min-w-0 flex-1 gap-3">
        <span class="truncate font-medium">Invoice {calculateInvoiceNumber(invoice)}</span>
        <span class="flex-shrink-0 text-gray-400">{renderDate(invoice.date)}</span>
        <span class="flex-shrink-0 text-gray-400">{calculateTotalForInvoice(invoice)} EUR</span>
      </div>

    </div>
  </Link>
  <div class="ml-4 flex-shrink-0">
    <button on:click={() => handleDownload(invoice.id)} class="font-medium text-indigo-600 hover:text-indigo-500">Download</button>
    {#if fileURL}
      <a bind:this={hiddenDownload} class="hidden" href={fileURL} download={`invoice-${calculateInvoiceNumber(invoice)}`}>
      </a>
    {/if}
  </div>

</li>
