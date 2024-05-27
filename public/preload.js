const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {

      //application commands
      exitApplication : () => {
        ipcRenderer.invoke("exit-application")
      },
      refreshApplication : () => {
        ipcRenderer.invoke("refresh-application")
      },

      deleteFile : () => {
        ipcRenderer.invoke('delete-file')
      },

      newFile : () => {
        ipcRenderer.invoke('new-file')
      },

      openFolder : () => {
        ipcRenderer.invoke('open-folder')
      },

      renameFile : () => {
        ipcRenderer.invoke('rename-file')
      },

      openFile : () => {
        ipcRenderer.invoke('open-file')
      },

      openMenu : () => {
        const result = ipcRenderer.invoke('get-menu-info')
        return result
      },

      openInbox : () => {
        const result = ipcRenderer.invoke('get-inbox-info')
        return result
      },

      saveData : (preferences, content) => {
        ipcRenderer.invoke('save-data', preferences, content)
      },

      openInboxFile : (filePath) => {
        ipcRenderer.invoke('open-inbox-file', filePath)
      },

      getData : () => {
        const result = ipcRenderer.invoke('get-data')
        return result
      }
  });