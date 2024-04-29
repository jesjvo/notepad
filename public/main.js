const { app, BrowserWindow, ipcMain, shell, dialog  } = require('electron/main');
const fs = require('node:fs')
const path = require('node:path')

const folder = path.join(app.getPath('appData'), 'notely')
const recovery = path.join(folder, 'Recovery')
const settingPreferences = path.join(folder, 'SettingPreferences.json')
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
  let lastOpened = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));
  let file={preferences:preferences, content:content}

  console.log(file)

  if(fs.existsSync(lastOpened.lastOpened)) {
    //save current file
    fs.writeFileSync(lastOpened.lastOpened, JSON.stringify(file, null, 2))
    let date = fs.statSync(lastOpened.lastOpened).mtime
    date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    return [date, 'Current File Saved']
  }else{
    //save new file (filedialog)
    let newFile = dialog.showSaveDialogSync(mainWindow,{
      properties: ['openFile', 'openDirectory'],
      filters: [
        { name: 'Notely', extensions: ['json'] },
      ]
    })
    //writing new file
    if(newFile){
      fs.writeFileSync(newFile, JSON.stringify(file, null, 2))
      //updating lastOpened
      lastOpened.lastOpened = newFile
      fs.writeFileSync(settingPreferences, JSON.stringify(lastOpened, null, 2))

      let date = fs.statSync(lastOpened.lastOpened).mtime
      date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
      
      return [date, 'New File Saved']
    }else{
      return [false, 'No File Saved']
    }
  }
})

//on opening application
ipcMain.handle('get-data', (event) => {
  let lastOpened = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  if(fs.existsSync(lastOpened.lastOpened)) {
    let file = JSON.parse(fs.readFileSync(lastOpened.lastOpened, 'utf8'));
    let preferences = {preferences:file.preferences}; const content = file.content;
    return [preferences, content]
  }else{
    return [null, null]
  }
})