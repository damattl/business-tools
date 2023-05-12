<script lang="ts">
  import { Address, Customer } from "$lib/models/customer.model"
  import { DataService } from "$lib/services/data.service"
  import FormDialog from "./FormDialog.svelte"
  import { createEventDispatcher } from "svelte"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { DialogMode } from "$lib/utils/dialog.utils"

  export let show = false
  export let mode = DialogMode.ADD
  export let customer: Customer | undefined = undefined

  const dispatch = createEventDispatcher<{result: DialogResult}>()

  function customerFromFormData(form: HTMLFormElement): Customer {
    let formData = new FormData(form)
    const customer = new Customer()
    customer.firstName = formData.get("firstName").toString()
    customer.lastName = formData.get("lastName").toString()
    customer.company = formData.get("company").toString()
    customer.mail = formData.get("mail").toString()
    customer.phone = formData.get("phone").toString()

    const address = new Address()
    address.street = formData.get("street").toString()
    address.streetNr = formData.get("streetNr").toString()
    address.city = formData.get("city").toString()
    address.postalCode = formData.get("postalCode").toString()

    customer.address = address

    return customer
  }
  async function addCustomer(form: HTMLFormElement): Promise<void> {
    const customer = customerFromFormData(form)
    const result = DataService.instance().post(`/customers`, customer, Customer)
    if (result) {
      show = false
      dispatch("result", {
        id: null,
        action: "add",
        success: true,
      })
    }
  }

  async function updateCustomer(form: HTMLFormElement): Promise<void> {
    const update = customerFromFormData(form)
    console.log(update)
    const result = DataService.instance().post(`/customers/${customer.id}`, update, Customer)
    if (result) {
      show = false
      dispatch("result", {
        id: customer.id,
        action: "edit",
        success: true,
      })
    }
  }
</script>

<FormDialog
  mode={mode}
  headline="Customer"
  addCb={addCustomer}
  updateCb={updateCustomer}
  bind:show={show}
>
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-4" value={customer?.firstName ?? null} name="firstName" type="text" placeholder="First name">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-4" value={customer?.lastName ?? null} name="lastName" type="text" placeholder="Last name">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-8" value={customer?.company ?? null} name="company" type="text" placeholder="Company">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-8" value={customer?.mail ?? null} name="mail" type="email" placeholder="E-Mail">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-8" value={customer?.phone ?? null} name="phone" type="tel" placeholder="Phone">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-6" value={customer?.address.street ?? null} name="street" type="text" placeholder="Street">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-2" value={customer?.address.streetNr ?? null} name="streetNr" type="text" placeholder="Street Nr.">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-2" value={customer?.address.postalCode ?? null} name="postalCode" type="text" placeholder="Postal Code">
  <input class="border rounded-lg px-2 py-1 mb-2 col-span-6" value={customer?.address.city ?? null} name="city" type="text" placeholder="City">

</FormDialog>
