const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
      //saving
      uploadFile : (uploadCode, fileContent, preferences) => {
        ipcRenderer.invoke("upload-to-file", uploadCode, fileContent, preferences)
      },

      //change font
      changeFont : (fontCode, fontStyle) => {
        ipcRenderer.invoke("change-font", fontCode, fontStyle)
      },

      //change favorite
      changeFavorite : (favoriteCode, isFavorite) => {
        ipcRenderer.invoke("change-favorite", favoriteCode, isFavorite)
      },

      //change spellcheck ------------------------------------------------------------------------------------

      //change name ------------------------------------------------------------------------------------

      //application commands
      exitApplication : (exitCode) => {
        ipcRenderer.invoke("exit-application", exitCode)
      },
      refreshApplication : (refreshCode) => {
        ipcRenderer.invoke("refresh-application", refreshCode)
      },
      openRecovery : (openCode) => {
        ipcRenderer.invoke("open-recovery", openCode)
      },

      //initiated
      openApplication : (openingCode) => {
        const filePreferencesResult = ipcRenderer.invoke("open-application", openingCode)
        return filePreferencesResult
      },
  });