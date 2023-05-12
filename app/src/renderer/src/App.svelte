<script lang="ts">
  import "./styles/app.css"
  import { Router, Link, Route } from "svelte-routing"
  import Home from "./routes/Home.svelte"
  import Invoices from "./routes/Invoices.svelte"
  import Navigation from "./components/Navigation.svelte";
  import Customers from "./routes/Customers.svelte"
  import Customer from "./routes/Customer.svelte"
  import Invoice from "./routes/Invoice.svelte"
  import Products from "./routes/Products.svelte"

  export let url = "/"
</script>

<Router {url}>
  <div class="flex flex-row h-full">
    <Navigation/>
    <div class="mt-4 mx-6 w-full">
      <Route path="/customers"><Customers/></Route>
      <Route path="/customers/:customerId" let:params>
        <Customer customerId={params.customerId}></Customer>
      </Route>
      <Route path="/invoices"><Invoices/></Route>
      <Route path="/invoices/:invoiceId" let:params>
        <Invoice invoiceId={params.invoiceId}></Invoice>
      </Route>
      <Route path="/products"><Products/></Route>
      <Route path="/"><Home /></Route>
    </div>
  </div>
</Router>

<style>

</style>
