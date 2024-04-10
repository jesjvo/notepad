const { app, BrowserWindow, ipcMain  } = require('electron/main');
const fs = require('node:fs')
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

    console.log
    (`\nExit [CMD + C]\n`, '\n__dirname', __dirname, '\n__filename', __filename, '\n__appPath', app.getAppPath())
    console.log('\nPreload File Located : ', path.join(__dirname, 'preload.js'))

});

//Security Risk Prvention
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
    })
  }
)

//Security Risk Prvention
app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      return { action: 'deny' }
    })
  }
)

//Handle uploading files
/*
 1. check if file is "a file" or "untitled" (if file is in list of files or isn't)
 2. a) if file "is file" -> continue
 2. b) else is file "untitled" -> create new file (with electron save file)
 3. save content into "file"
*/
ipcMain.handle('upload-to-file', (event, content) => {
  const file = path.join(__dirname, 'File.json')
  fs.writeFile(file, content, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`\nSystem- Successfull File Written ::\n-> {\n`,content,'\n} <-\n')
    }
  });
})
/*

File Management

--Directory[
  --Setting Folder[
    File .includes(Window Size, Last Opened File)
  ]
  --BackUp Folder[
    --FileName + Date Of BackUp
  ]
  --File Information[
    File .includes(File Path, isFavorite, Updated Last, Creation Date, Font Style)
  ]
]
*/