<script lang="ts">
  import { calculateInvoiceNumber, calculateTotalForInvoice, renderDate } from "../utils/invoice.utils"
  import { Link } from "svelte-routing"
  import { Invoice } from "$lib/models/invoice.model"
  import { DataService } from "$lib/services/data.service"
  import { renderInvoice } from "$lib/utils/render.utils"
  import { tick } from "svelte"
  import { graphAPI } from "$lib/services/graph.api"
  import { Customer } from "$lib/models/customer.model"
  import { CONTENT_TYPE } from "$lib/utils/graph.utils"

  export let invoice: Invoice
  export let withShadow = false

  let hiddenDownload: HTMLAnchorElement | undefined
  let fileURL: string | undefined
  async function handleDownload(id: number): Promise<void> {
    const fileType = "docx"

    const result = await DataService.instance().get(`/invoices/${id}`, Invoice)
    const invoice = result.result;

    console.log(invoice)

    const renderResponse = await renderInvoice(result.result, fileType)
    if (renderResponse.ok) {
      const blob = await renderResponse.blob()
      const file = new File([blob], `Invoice-${calculateInvoiceNumber(invoice)}.docx`) // TODO: Make variable

      const customer = await DataService.instance().get(`/customers/${invoice.customerId}`, Customer).then(result => result.result)

      const docxUploadResult = await graphAPI.uploadFile(`${customer.firstName} ${customer.lastName}`, file, CONTENT_TYPE.docx)

      // Generate PDF
      const pdfBuffer = await graphAPI.downloadAsPDF(docxUploadResult)
      const pdf = new File([pdfBuffer], `Invoice-${calculateInvoiceNumber(invoice)}.pdf`)

      await graphAPI.uploadFile(`${customer.firstName} ${customer.lastName}`, pdf, CONTENT_TYPE.pdf)

      fileURL = URL.createObjectURL(pdf)
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
      <a bind:this={hiddenDownload} class="hidden" href={fileURL} download={`Invoice-${calculateInvoiceNumber(invoice)}.pdf`}>
      </a>
    {/if}
  </div>

</li>
