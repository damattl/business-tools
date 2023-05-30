<script lang="ts">
import { Link } from "svelte-routing"
import type { Customer } from "$lib/models/customer.model"

export let customer: Customer
</script>

<Link class="w-full break-all" to="/customers/{customer.id}">
  <li class="flex items-center justify-between w-full shadow rounded-lg py-4 pl-4 pr-5 text-sm leading-6">
    <div class="flex w-0 flex-1 items-center">
      <i class="uil uil-user text-lg text-gray-500"></i>



      <div class="ml-4 flex min-w-0 flex-1 gap-3">
        <div class="flex flex-1 gap-3">
          <span class="truncate font-medium">
            {customer.firstName}
            {customer.lastName}
          </span>
          { #if customer.company || customer.company !== "" }
            <span class="flex-shrink-0 text-gray-400">{customer.company}</span>
          { /if }
        </div>
        <span class="flex-shrink-0 text-gray-400">
          Open Invoices: {customer.invoices.filter(invoice => invoice.status === "OPEN").length}
        </span>
      </div>
    </div>
  </li>
</Link>
