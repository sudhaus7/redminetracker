import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  settings: {
    get: (key) => ipcRenderer.invoke('settings:get', key),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value)
  },
  tracker: {
    setActive: (active) => ipcRenderer.invoke('tracker:setActive', !!active)
  },
  redmine: {
    setActive: (config) => ipcRenderer.invoke('redmine:setActive', config),
    issues: (params) => ipcRenderer.invoke('redmine:issues', params),
    issue: (id) => ipcRenderer.invoke('redmine:issue', id),
    timeEntries: (params) => ipcRenderer.invoke('redmine:timeEntries', params),
    createTimeEntry: (payload) => ipcRenderer.invoke('redmine:createTimeEntry', payload),
    updateTimeEntry: (id, payload) => ipcRenderer.invoke('redmine:updateTimeEntry', id, payload),
    activities: (config) => ipcRenderer.invoke('redmine:activities', config)
  }
})
