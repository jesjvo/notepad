const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myApp", {
      uploadFile : (fileContent) => {
        ipcRenderer.invoke("upload-to-file", fileContent)
      },
      
  });