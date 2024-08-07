'use strict'

import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import { NativeHandler } from './native/NativeHandler';
import { Utils } from './shared/Utils';
import path from "path";

declare const __static: string;
const isDevelopment = process.env.NODE_ENV !== 'production';
const preload = isDevelopment ? "../public/preload.js" : "./preload.js";

let browserWindow: BrowserWindow;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  browserWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    icon: Utils.joinPath(__static, 'icon.png'),

    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      preload: path.join(__dirname, preload), // path to your preload.js file
    }
  });

  browserWindow.setMenuBarVisibility(false);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await browserWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string, {"extraHeaders" : "pragma: no-cache"});
    if (!process.env.IS_TEST) browserWindow.webContents.openDevTools()
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    browserWindow.loadURL('app://./index.html');
  }
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    console.log('decodingUIR');
    const pathname = decodeURI(request.url.replace('file:///', ''));
    console.log("pathName", pathname);
    callback(pathname);
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e: any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  await createWindow();
  const nativeHandler = new NativeHandler(browserWindow);
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    })
  }
}
