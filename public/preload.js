const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {

      //application commands
      exitApplication : () => {
        ipcRenderer.invoke("exit-application")
      },
      refreshApplication : () => {
        ipcRenderer.invoke("refresh-application")
      },
      openRecovery : () => {
        ipcRenderer.invoke("open-recovery")
      },

      openMenu : () => {
        const result = ipcRenderer.invoke('get-menu-dates')
        return result
      },

      saveData : (preferences, content) => {
        ipcRenderer.invoke('save-data', preferences, content)
      },

      getData : () => {
        const result = ipcRenderer.invoke('get-data')
        return result
      }
  });