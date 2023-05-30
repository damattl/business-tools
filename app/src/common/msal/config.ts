import { Configuration } from "@azure/msal-node"

import { join } from "path"
import { DataProtectionScope, Environment } from "@azure/msal-node-extensions"


export const cachePath = join(Environment.getUserRootDirectory() ?? "", "./cache.json")
export const cacheConfig = {
  cachePath,
  dataProtectionScope: DataProtectionScope.CurrentUser,
  serviceName: "Business-Tools",
  accountName: "Business-Tools-Client",
  usePlaintextFileOnLinux: false,
}

export const msalAuthConfig: Configuration = {
  auth: {
    clientId: "2ed37118-28ff-45f8-a851-917b18588fcf",
    authority: "https://login.microsoftonline.com/8aaf99d3-f99b-4407-bab6-91e490d3ede1"
  },
}




/*const msalConfig = {
  clientId: '2ed37118-28ff-45f8-a851-917b18588fcf',
  authority: 'https://login.microsoftonline.com/8aaf99d3-f99b-4407-bab6-91e490d3ede1',
  mainWindow: mainWindow,
  cachePlugin: SimpleCachePlugin,
  scopes: [
    'user.read',
    'mail.read',
    'mail.send'
  ]
};*/

