const { app, BrowserWindow, ipcMain  } = require('electron/main');
const fs = require('node:fs')
const path = require('node:path')

const folder = path.join(app.getPath('appData'), 'Notely')
const Recovery = path.join(folder, 'Recovery')
const Settings = path.join(folder, 'Settings')

const SettingPreference = path.join(Settings, 'SettingPreference.json')
const FileDependent = path.join(Settings, 'FileDependent.json')

//updated upon closing application & refreshing.
const settingStructure=
{ 
  activeFile:null,
  lastOpened:null,
  windowSize:null,
}

const fileStructure=
{
  path:[ //each opened/saved file includes <--
    {
      name:null,
      isFavorite:false,
      date:{
        updatedLast:null,
        creationDate:null,
      },
      fontStyle:'Pt Sans',
    }
  ]
}

console.log('File Structure\n', JSON.stringify(FileDependentStructure, null, 2))

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

    //mainWindow.webContents.openDevTools()
    mainWindow.loadURL('http://localhost:3000') //temporary


    console.log(`\nExit [CMD + C]\n`, '\n__dirname', __dirname, '\n__filename', __filename, '\n__appPath', app.getAppPath(), '\n__appData', app.getPath('appData'))
    console.log('\nPreload File Located : ', path.join(__dirname, 'preload.js'))
});

//Security Risk Prvention
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
    })
  }
)
app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      return { action: 'deny' }
    })
  }
)

//Exit Application
ipcMain.handle('exit-application', (event, exitCode) => {
  if(exitCode){
    app.quit()
  }
})

//Refresh Application
ipcMain.handle('refresh-application', (event, refreshCode) => {
  if(refreshCode){
    mainWindow.webContents.reloadIgnoringCache()
  }
})

//Handle receiving files (for files list)
/*
  1. 
*/

//Handle receiving file information (for menu with active file)
/*
  1. current file's -> path (for rename), creation date, last updated, 
*/

//Handle open file
/*
  1. electron opens 'open file'
  2. the file selected is analysed (.json)
  3. if correct, replaces current file or untitled
  4. inserting content and changing current file to file selected
*/

//Handle new file
/*
  1. clear text editor
  2. clear current file, change to ('untitled')
*/

//Handle uploading files
/*
 1. check if file is "a file" or "untitled" (if file is in list of files or isn't)
 2. a) if file "is file" -> continue
 2. b) else is file "untitled" -> create new file (with electron save file)
 3. save content into "file"
*/
ipcMain.handle('upload-to-file', (event, content) => {
  const file = path.join(__dirname, 'File.json')
  fs.writeFileSync(file, content, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`\nSystem- Successfull File Written ::\n-> {\n`,content,'\n} <-\n')
    }
  });
})
/*

File Management ---> AppData Path

*/