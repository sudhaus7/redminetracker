'use strict'

import { app, protocol, BrowserWindow, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = true; //process.env.NODE_ENV !== 'production'

import ElectronStore from 'electron-store';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const SettingsStore = new ElectronStore();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // Create the browser window.

  const { screenwidth, screenheight } = screen.getPrimaryDisplay().workAreaSize
  //console.log(width,height);


  let winbounds = SettingsStore.get('win') || {width:800,height:600,x:100,y:100};
  // maximise height to screenheight;
  if (winbounds.y+winbounds.height > screenheight) {
    winbounds.y = 10;
    if (winbounds.y+winbounds.height > screenheight) {
      winbounds.height = screenheight-20;
    }
  }
  // maximise width to screen width
  if (winbounds.x+winbounds.width > screenwidth) {
    winbounds.x = 10;
    if (winbounds.x+winbounds.width > screenwidth) {
      winbounds.width = screenwidth-20;
    }
  }

  win = new BrowserWindow({
    width: winbounds.width,
    height: winbounds.height,
    x: winbounds.x,
    y: winbounds.y,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule: true,
      //process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  win.on('resize',function(event,x,y) {
    SettingsStore.set('win',win.getBounds());
  })
  win.on('moved',function(event,x,y) {
    SettingsStore.set('win',win.getBounds());
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') {
    app.quit()
  //}
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
