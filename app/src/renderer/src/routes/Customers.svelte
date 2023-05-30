<script lang="ts">
  import { DataService } from "$lib/services/data.service"
  import { Customer } from "$lib/models/customer.model"
  import CustomerListItem from "$lib/components/CustomerListItem.svelte"
  import CustomerDialog from "$lib/components/dialogs/CustomerDialog.svelte"

  let customers: Customer[] = [];
  DataService.instance()
    .getList(`/customers`, Customer)
    .then((result) => {
      customers = result.result
    })

  let showDialog: boolean
  $: showDialog = false

</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="flex flex-row justify-between my-4">
    <h2>Customers</h2>
    <div>
      <button on:click={() => {showDialog = true}} class="border hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm">
        <i class="uil uil-plus"></i>
        Add
      </button>
    </div>
  </div>
  <div class="flex flex-col overflow-y-scroll flex-grow gap-2">
    { #each customers as customer }
      <CustomerListItem customer={customer} />
    {/each}
  </div>


  <CustomerDialog bind:show={showDialog}/>
</div>
