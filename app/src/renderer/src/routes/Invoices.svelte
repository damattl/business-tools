<script lang="ts">
  import { Invoice } from "$lib/models/invoice.model"
  import { DataService } from "$lib/services/data.service"
  import InvoiceListItem from "$lib/components/InvoiceListItem.svelte"

  let invoices: Invoice[] = []
  DataService.instance()
    .getList(`/invoices`, Invoice)
    .then((result) => {
      invoices = result.result
      console.log(invoices)
    })

</script>

<div class="flex flex-row justify-between my-4">
  <h2>Invoices</h2>
</div>
<div class="flex flex-col gap-2 break-all">
  { #each invoices as invoice }
    <InvoiceListItem invoice={invoice} withShadow={true}/>
  {/each}

</div>
