<script lang="ts">
import { Link } from "svelte-routing";
</script>

<nav class="flex flex-col justify-start min-w-[200px] h-full shadow py-10">
  <Link let:active to="/">
    <div class="px-4 py-2 hover:bg-gray-100 {active ? 'bg-gray-100' : '' }">
      <i class="uil uil-estate text-xl mx-2"></i>
      Home
    </div>

  </Link>
  <Link let:active  to="/invoices">
    <div class="px-4 py-2 hover:bg-gray-100 {active ? 'bg-gray-100' : '' }">
      <i class="uil uil-invoice text-xl mx-2"></i>
      Invoices
    </div>
  </Link>
  <Link let:active  to="/customers">
    <div class="px-4 py-2 hover:bg-gray-100 {active ? 'bg-gray-100' : '' }">
      <i class="uil uil-users-alt text-xl mx-2"></i>
      Customers
    </div>
  </Link>
  <Link let:active to="/products">
    <div class="px-4 py-2 hover:bg-gray-100 {active ? 'bg-gray-100' : '' }">
      <i class="uil uil-create-dashboard text-xl mx-2"></i>
      Products
    </div>
  </Link>
  <Link let:active to="/graph">
    <div class="px-4 py-2 hover:bg-gray-100 {active ? 'bg-gray-100' : '' }">
      <i class="uil uil-microsoft text-xl mx-2"></i>
      Microsoft Graph
    </div>
  </Link>
</nav>
