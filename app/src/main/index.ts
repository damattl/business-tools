import { app, shell, BrowserWindow } from "electron"
import { join } from "path"
import { electronApp, optimizer, is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"
import { AuthProvider } from "$common/msal/provider"
import { cacheConfig, msalAuthConfig } from "$common/msal/config"
import { ipcMain } from "electron"
import { IPC_MESSAGES } from "$common/ipcConstants"
import { getGraphClient } from "../common/graph/client"
import { GraphRequestParams } from "../common/processApi"
import { PersistenceCachePlugin, PersistenceCreator } from "@azure/msal-node-extensions"
import { GraphRequest } from "@microsoft/microsoft-graph-client"



let authProvider: AuthProvider | null
let mainWindow: BrowserWindow | null

async function loadMain() {
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    await mainWindow?.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    await mainWindow?.loadFile(join(__dirname, "../renderer/index.html"))
  }
}

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  })

  const persistence = await PersistenceCreator.createPersistence(cacheConfig)

  authProvider = new AuthProvider({
    ...msalAuthConfig,
    cache: {
      cachePlugin: new PersistenceCachePlugin(persistence)
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  await loadMain()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron")

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await createWindow()

  app.on("activate", async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle(IPC_MESSAGES.LOGIN, async () => {
  const account = await authProvider?.login() || null;
  console.log(account);
  // await loadMain()
  return authProvider?.account
})

ipcMain.handle(IPC_MESSAGES.LOGOUT, async () => {
  await authProvider?.logout();
  return true
})

ipcMain.handle(IPC_MESSAGES.GET_ACCOUNT, async () => {
  return authProvider?.getAccount()
})

ipcMain.handle(
  IPC_MESSAGES.CREATE_GRAPH_REQUEST,
  async (_event, args: GraphRequestParams): Promise<GraphRequest | null> => {
    if (!authProvider || !mainWindow) {
      return null
    }

    const tokenRequest = {
      scopes: args.resource.scopes
    }

    const tokenResponse = await authProvider.getToken(tokenRequest);



    if (tokenResponse) {
      return getGraphClient(tokenResponse.accessToken)
        .api(args.resource.endpoint).headers(args.headers ?? {})
    }

    return null;
  }
)

ipcMain.handle(
  IPC_MESSAGES.GRAPH_REQUEST,
  async (_event, args: GraphRequestParams) => {
  if (!authProvider || !mainWindow) {
    return null
  }

  const tokenRequest = {
    scopes: args.resource.scopes
  }

  const tokenResponse = await authProvider.getToken(tokenRequest);



  if (tokenResponse) {
    const graphAPI = await getGraphClient(tokenResponse.accessToken)
      .api(args.resource.endpoint).headers(args.headers ?? {})

    switch (args.mode) {
      case "POST":
        return await graphAPI.post(args.body)
      case "GET":
        return await graphAPI.get();
      case "PUT":
        return await graphAPI.put(args.body)
      default:
        return null;
    }
  }

  return null;
})
