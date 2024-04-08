const { app, BrowserWindow, session, ipcMain  } = require('electron/main');
const path = require('node:path')

let mainWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        frame:false,
        minWidth: 380, minHeight: 320,
        width:380,
        height:320,
        webPreferences: {
            nodeIntegration:false,
            contextIsolation:true,
            sandbox:true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity:true,
            allowRunningInsecureContent: false,
            experimentalFeatures: false,
            }
        }
    );

    mainWindow.webContents.openDevTools()
    mainWindow.loadURL('http://localhost:3000')

    console.log(`Exit [CMD + C]`)
    console.log('Preload File Located : ', path.join(__dirname, 'preload.js'))

    ipcMain.handle('message', (e) => {
        if (!validateSender(e.senderFrame)) return null
        return getSecrets()
      })
      
      function validateSender (frame) {
        // Value the host of the URL using an actual URL parser and an allowlist
        if ((new URL(frame.url)).host === 'electronjs.org') return true
        return false
      }

});

// seek Security risk 13 for explanation.
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
    console.log('Attempted Navigation :&& Preventing Defaults--', navigationUrl)
    event.preventDefault()
    })
  })

app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
    console.log('System- ATTEMPTED URL OPEN ::Denied Action')
      return { action: 'deny' }
    })
  }
)