const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myApp", {
      uploadFile : (fileContent) => {
        ipcRenderer.invoke("upload-to-file", fileContent)
      },
      exitApplication : (exitCode) => {
        ipcRenderer.invoke("exit-application", exitCode)
      },
      refreshApplication : (refreshCode) => {
        ipcRenderer.invoke("refresh-application", refreshCode)
      },
  });