<script lang="ts">
import { Link } from "svelte-routing";
</script>

<nav class="flex flex-col justify-start min-w-[200px] h-full shadow py-10">
  <Link class="px-4 py-2" to="/"><i class="uil uil-estate text-xl mx-2"></i>Home</Link>
  <Link class="px-4 py-2" to="/invoices"><i class="uil uil-invoice text-xl mx-2"></i>Invoices</Link>
  <Link class="px-4 py-2" to="/customers"><i class="uil uil-users-alt text-xl mx-2"></i>Customers</Link>
  <Link class="px-4 py-2" to="/products"><i class="uil uil-create-dashboard text-xl mx-2"></i>Products</Link>
</nav>
