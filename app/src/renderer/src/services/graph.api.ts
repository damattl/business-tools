import type { MsalAPI } from "$common/processApi"
import { protectedResources } from "$common/graph/resources"
import type { Contact, Drive, DriveItem } from "@microsoft/microsoft-graph-types"
import { buildResourceConfig, getDriveItemPath } from "$lib/utils/graph.utils"

// @ts-ignore Api exists, but is not recognized by TS
const api = window.api as MsalAPI

async function getContacts() {
  return await api.makeGraphRequest({
    mode: "GET",
    resource: protectedResources.graphContacts,
  }).then(response => response?.value) as Promise<Contact[]>
}

async function getDrives() {
  return await api.makeGraphRequest({
    mode: "GET",
    resource: protectedResources.graphDrives,
  }).then(response => response?.value) as Promise<Drive[]>
}

async function getFilesOnDrive(id: string) {
  return await api.makeGraphRequest({
    mode: "GET",
    headers: {},
    resource: buildResourceConfig(
      `/drives/${id}/root/children`,
      ["Files.Read"]
    ),
    body: null
  }).then(response => response?.value) as Promise<DriveItem[]>
}


async function getItemsInFolder(path: string) {
  return await api.makeGraphRequest({
    mode: "GET",
    resource: {
      endpoint: `${path}/children`,
      scopes: ["Files.Read"],
    },
  }).then(response => response?.value) as Promise<DriveItem[]>
}

async function getCustomersFolderPath(): Promise<string | null> {
  const drives = await getDrives()
  if (!drives || drives.length === 0) {
    return null
  }
  const files = await getFilesOnDrive(drives[0].id)
  if (!files || files.length === 0) {
    return null
  }
  const folder = files.find(f => f.name === "Customers")
  console.log(folder)
  if (!folder) {
    return null
  }
  return getDriveItemPath(folder)
}

async function createCustomerDir(name: string) {
  const customersFolder = await getCustomersFolderPath()

  const driveItem = await api.makeGraphRequest({
    mode: "POST",
    resource: {
      endpoint: `${customersFolder}/children`,
      scopes: ["Files.ReadWrite"],
    },
    headers: {},
    body: {
      name: name,
      folder: {},
      '@microsoft.graph.conflictBehaviour': 'fail'
    }
  }) as DriveItem


  return await api.makeGraphRequest({
    mode: "POST",
    resource: {
      endpoint: getDriveItemPath(driveItem, "/children"),
      scopes: ["Files.ReadWrite"],
    },
    headers: {},
    body: {
      name: "Invoices",
      folder: {},
      '@microsoft.graph.conflictBehaviour': 'fail'
    }
  }).then(response => response?.value) as DriveItem
}

async function uploadFile(customerName: string, file: File, contentType: string) {
  const customersFolder = await getCustomersFolderPath()
  const items = await getItemsInFolder(customersFolder)

  const customerFolder = items.find(f => f.name === customerName)
  const customerItems = await getItemsInFolder(getDriveItemPath(customerFolder))

  const invoiceFolder = customerItems.find(f => f.name === "Invoices")

  console.log(customerFolder)
  if (!customerFolder) {
    return null
  }
  console.log(customerFolder.name)

  const stream = await file.arrayBuffer()
  return await api.makeGraphRequest({
    mode: "PUT",
    headers: {'Content-Type': contentType},
    resource: buildResourceConfig(
      `/drives/${invoiceFolder.parentReference.driveId}/items/${invoiceFolder.id}:/${file.name}:/content`,
      ["Files.ReadWrite"],
    ),
    body: stream
  }) as DriveItem
}

async function downloadAsPDF(item: DriveItem) {
  console.log(`/drive/items/${item.id}/content?format=pdf`)
  return await api.makeGraphRequest({
    mode: "GET_STREAM",
    resource: buildResourceConfig(
      `/drive/items/${item.id}/content?format=pdf`,
      ["Files.ReadWrite"],
    )
  })
}

export const graphAPI = {
  getContacts: getContacts,
  getDrives: getDrives,
  getFilesOnDrive: getFilesOnDrive,
  getCustomersFolderPath: getCustomersFolderPath,
  createCustomerDir: createCustomerDir,
  uploadFile: uploadFile,
  downloadAsPDF: downloadAsPDF,
}
