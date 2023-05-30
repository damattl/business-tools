<script lang="ts">
  import { Address, Customer } from "$lib/models/customer.model"
  import { DataService } from "$lib/services/data.service"
  import FormDialog from "./FormDialog.svelte"
  import { createEventDispatcher, onMount } from "svelte"
  import type { DialogResult } from "$lib/utils/dialog.utils"
  import { DialogMode } from "$lib/utils/dialog.utils"
  import type { Contact } from "@microsoft/microsoft-graph-types"
  import { graphAPI } from "$lib/services/graph.api"

  export let show = false
  export let mode = DialogMode.ADD
  export let customer: Customer | undefined = undefined

  let contacts: Contact[] = []
  let selectedContact: Contact | undefined
  let selectedContactId: string | undefined

  onMount(async () => {
    // TODO Make optional
    contacts = await graphAPI.getContacts() ?? []
    selectedContactId = customer?.microsoftContactId
  })

  const dispatch = createEventDispatcher<{result: DialogResult}>()

  function customerFromFormData(form: HTMLFormElement): Customer {
    let formData = new FormData(form)
    const customer = new Customer()
    customer.microsoftContactId = formData.get("microsoftContactId").toString()
    customer.title = formData.get("title").toString()
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
  <select on:change={event => {selectedContact = contacts.find(c => c.id === event.target.value)}} bind:value={selectedContactId} class="border rounded-lg px-2 py-1 mb-2 col-span-8" name="microsoftContactId">
    <option>Link to Microsoft Contact</option>
    {#each contacts as contact}
      <option value={contact.id}>
        {contact.givenName} {contact.surname} @{contact.companyName}
      </option>
    {/each}
  </select>
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-1"
    value={customer?.title ?? selectedContact?.title ?? null} name="title" type="text" placeholder="Title">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-4"
    value={customer?.firstName ?? selectedContact?.givenName ?? null} name="firstName" type="text" placeholder="First name">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-3"
    value={customer?.lastName ?? selectedContact?.surname ?? null} name="lastName" type="text" placeholder="Last name">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-8"
    value={customer?.company ?? selectedContact?.companyName ?? null} name="company" type="text" placeholder="Company">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-8"
    value={customer?.mail ?? selectedContact?.emailAddresses?.at(0).address ?? null} name="mail" type="email" placeholder="E-Mail">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-8"
    value={customer?.phone ?? selectedContact?.businessPhones?.at(0) ?? null} name="phone" type="tel" placeholder="Phone">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-6"
    value={customer?.address.street ?? selectedContact?.businessAddress?.street?.split(" ").at(0) ?? null} name="street" type="text" placeholder="Street">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-2"
    value={customer?.address.streetNr ?? selectedContact?.businessAddress?.street?.split(" ").at(1) ?? null} name="streetNr" type="text" placeholder="Street Nr.">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-2"
    value={customer?.address.postalCode ?? selectedContact?.businessAddress?.postalCode ?? null} name="postalCode" type="text" placeholder="Postal Code">
  <input
    class="border rounded-lg px-2 py-1 mb-2 col-span-6"
    value={customer?.address.city ?? selectedContact?.businessAddress?.city ?? null} name="city" type="text" placeholder="City">

</FormDialog>
