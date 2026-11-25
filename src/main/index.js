import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'node:path'
import Store from 'electron-store'
import { redmine } from './redmine.js'

const SettingsStore = new Store()
const ALLOWED_KEYS = ['redmineconfigs']

let win = null
let quitting = false
const isMac = process.platform === 'darwin'
let activeConfig = null

function firstConfig() {
  const configs = SettingsStore.get('redmineconfigs') || []
  return configs[0] || null
}

if (!SettingsStore.get('redmineconfigs')) {
  SettingsStore.set('redmineconfigs', [])
}
activeConfig = firstConfig()

// a change of the configured instances resets the active one to the first
SettingsStore.onDidChange('redmineconfigs', () => {
  activeConfig = firstConfig()
})

function checkKey(key) {
  if (!ALLOWED_KEYS.includes(key)) {
    throw new Error('Unknown settings key')
  }
}

ipcMain.handle('settings:get', (_e, key) => {
  checkKey(key)
  return SettingsStore.get(key)
})
ipcMain.handle('settings:set', (_e, key, value) => {
  checkKey(key)
  SettingsStore.set(key, value)
})

// show a Dock badge while time is being tracked (macOS)
ipcMain.handle('tracker:setActive', (_e, active) => {
  if (isMac) app.dock.setBadge(active ? '●' : '')
})

ipcMain.handle('redmine:setActive', (_e, config) => {
  activeConfig = config
})
ipcMain.handle('redmine:issues', (_e, params) => redmine.issues(activeConfig, params))
ipcMain.handle('redmine:issue', (_e, id) => redmine.issue(activeConfig, id))
ipcMain.handle('redmine:timeEntries', (_e, params) => redmine.timeEntries(activeConfig, params))
ipcMain.handle('redmine:createTimeEntry', (_e, payload) => redmine.createTimeEntry(activeConfig, payload))
ipcMain.handle('redmine:updateTimeEntry', (_e, id, payload) => redmine.updateTimeEntry(activeConfig, id, payload))
// uses the config passed from the settings form (may be unsaved)
ipcMain.handle('redmine:activities', (_e, config) => redmine.activities(config))

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize

  const winbounds = SettingsStore.get('win') || { width: 800, height: 600, x: 100, y: 100 }
  // keep the window on screen
  if (winbounds.y + winbounds.height > screenHeight) {
    winbounds.y = 10
    if (winbounds.y + winbounds.height > screenHeight) {
      winbounds.height = screenHeight - 20
    }
  }
  if (winbounds.x + winbounds.width > screenWidth) {
    winbounds.x = 10
    if (winbounds.x + winbounds.width > screenWidth) {
      winbounds.width = screenWidth - 20
    }
  }

  win = new BrowserWindow({
    width: winbounds.width,
    height: winbounds.height,
    x: winbounds.x,
    y: winbounds.y,
    webPreferences: {
      preload: join(import.meta.dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // keep the tracker timer exact while the window is hidden
      backgroundThrottling: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(import.meta.dirname, '../renderer/index.html'))
  }

  // on macOS closing the window only hides it so tracking keeps running;
  // the app quits through Cmd+Q, the app menu or the Dock menu
  win.on('close', (event) => {
    if (isMac && !quitting) {
      event.preventDefault()
      win.hide()
    }
  })

  win.on('closed', () => {
    win = null
  })
  const saveBounds = () => SettingsStore.set('win', win.getBounds())
  win.on('resize', saveBounds)
  win.on('moved', saveBounds)
}

app.on('before-quit', () => {
  quitting = true
})

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  } else {
    win.show()
  }
})

app.whenReady().then(createWindow)
