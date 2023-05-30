import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_MESSAGES } from "$common/ipcConstants"
import { GraphRequestParams, MsalAPI } from "$common/processApi"
import { AccountInfo } from "@azure/msal-node"

// Custom APIs for renderer
const api: MsalAPI = {
  getAccount: (): Promise<AccountInfo | null> => {
    return ipcRenderer.invoke(IPC_MESSAGES.GET_ACCOUNT)
  },
  login: (): Promise<AccountInfo | null> => {
    return ipcRenderer.invoke(IPC_MESSAGES.LOGIN);
  },
  logout: (): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_MESSAGES.LOGOUT);
  },
  makeGraphRequest: (params: GraphRequestParams) => {
    return ipcRenderer.invoke(IPC_MESSAGES.GRAPH_REQUEST, params);
  },
  createGraphRequest: (params: GraphRequestParams) => {
    return ipcRenderer.invoke(IPC_MESSAGES.CREATE_GRAPH_REQUEST, params);
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
