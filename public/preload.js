const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
      uploadFile : (fileContent) => {
        ipcRenderer.invoke("upload-to-file", fileContent)
      },
      exitApplication : (exitCode) => {
        ipcRenderer.invoke("exit-application", exitCode)
      },
      refreshApplication : (refreshCode) => {
        ipcRenderer.invoke("refresh-application", refreshCode)
      },
      openRecovery : (openCode) => {
        ipcRenderer.invoke("open-recovery", openCode)
      },
      openApplication : (openingCode) => {
        const filePreferencesResult = ipcRenderer.invoke("open-application", openingCode)
        return filePreferencesResult
      },
  });