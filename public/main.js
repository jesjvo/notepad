const { app, BrowserWindow, ipcMain, shell  } = require('electron/main');
const fs = require('node:fs')
const path = require('node:path')

const folder = path.join(app.getPath('appData'), 'notely')
const recovery = path.join(folder, 'Recovery')
const settingPreferences = path.join(folder, 'SettingPreferences.json')
var lastOpened = null //current last opened

const settingStructure =
{ 
  lastOpened:null, //the file path
  files:{
      path:null,
    }
}

const checkFolders=()=>{
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
    console.log('Notely Folder Created~');
  }
  if (!fs.existsSync(recovery)) {
    fs.mkdirSync(recovery)
    console.log('Recovery Folder Created');
  }
  if (!fs.existsSync(settingPreferences)) {
    fs.writeFileSync(settingPreferences, JSON.stringify(settingStructure, null, 2))
    console.log('Setting File Created');
  }
}

checkFolders()

let mainWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        frame:false,
        minWidth: 380, minHeight: 320,
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

    mainWindow.webContents.openDevTools() //temporary
    mainWindow.loadURL('http://localhost:3000') //temporary

    console.log('\n__dirname', __dirname, '\n__filename', __filename, '\n__appPath', app.getAppPath(), '\n__appData', app.getPath('appData'))
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
ipcMain.handle('exit-application', (event) => {
  app.quit()
})

//Refresh Application
ipcMain.handle('refresh-application', (event) => {
  mainWindow.webContents.reloadIgnoringCache()
})

//Open Recovery
ipcMain.handle('open-recovery', (event) => {
  shell.openPath(recovery)
})

//on save data
ipcMain.handle('save-data', (event, preferences, content) => {
  const lastOpened = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8'))).lastOpened;
  const file={preferences:preferences, content:content}

  console.log(file)

  if(fs.existsSync(lastOpened)) {
    //save current file
    fs.writeFileSync(lastOpened, JSON.stringify(file, null, 2))
  }else{
    //save new file
  }
})

//on opening application
ipcMain.handle('get-data', (event) => {
  const lastOpened = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8'))).lastOpened;

  if(fs.existsSync(lastOpened)) {
    const file = JSON.parse(fs.readFileSync(lastOpened, 'utf8'));
    const preferences = {preferences:file.preferences}; const content = file.content;
    return [preferences, content]
  }else{
    return [null, null]
  }
})