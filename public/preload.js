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

      deleteFile : () => {
        ipcRenderer.invoke('delete-file')
      },

      newFile : () => {
        ipcRenderer.invoke('new-file')
      },

      renameFile : (fileName) => {
        ipcRenderer.invoke('rename-file', fileName)
      },

      openFile : () => {
        ipcRenderer.invoke('open-file')
      },

      openMenu : () => {
        const result = ipcRenderer.invoke('get-menu-info')
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