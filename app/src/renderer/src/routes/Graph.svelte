<script lang="ts">

  import type { MsalAPI } from "$common/processApi"
  import type { AccountInfo } from "@azure/msal-node"
  import { onMount } from "svelte"
  import { graphAPI } from "$lib/services/graph.api"
  import type { Contact } from "@microsoft/microsoft-graph-types"


  const api = window.api as MsalAPI
  let account: AccountInfo | null = null
  let contacts: Contact[] = []

  onMount(async () => {
    account = await api.getAccount()
  })

  async function login() {
    account = await api.login()

  }

  async function logout() {
    await api.logout()
    account = null
  }

  async function getProfile() {
    const acc = await api.getAccount()
    console.log(acc)
  }

  async function getData() {
    console.log(await graphAPI.getDrives())
    console.log(await graphAPI.getCustomersFolderPath())
    contacts = await graphAPI.getContacts()
   // await graphAPI.createCustomerDir("Simon Fink")
  }

</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="flex flex-row justify-between my-4">
    <h2>Microsoft Graph</h2>
    <div>
      {#if !account}
        <button on:click={login} class="border  hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm">
          <i class="uil uil-signin"></i>
          Login
        </button>
      {:else}
        <button on:click={logout} class="border  hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm">
          <i class="uil uil-signout"></i>
          Logout
        </button>
      {/if}
    </div>
  </div>


  <p>Currently authenticated as {account?.name}</p>

  <div class="mt-4">
    <button on:click={getProfile} class="border hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm">
      Get Profile
    </button>

    <button on:click={getData} class="border hover:shadow-inner transition-shadow px-4 py-1 rounded-lg text-sm">
      Test Data Connection
    </button>
  </div>

</div>





