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

const defaultFileStructure =
{
  preferences:
    {
      isNewFile:true,
      name:"Untitled",
      isFavorite:false,
      date:{
        updatedLast:null,
        createdDate:null
      },
      fontStyle:"Pt Sans",
      spellCheck:true,
  },
  content:{
    //content of editor
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

const checkLastOpened=()=>{
  const settingPreferencesResult = JSON.parse(fs.readFileSync(settingPreferences, 'utf8'));
  return settingPreferencesResult.lastOpened
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

//Open Recovery
ipcMain.handle('open-recovery', (event, openCode) => {
  if(openCode){
    shell.openPath(recovery)
  }
})

//saving file content
ipcMain.handle('upload-to-file', (event, openCode, fileContent, preferences) => {

  if(openCode){
  //gets lastOpened
  lastOpened=checkLastOpened()

  if(fs.existsSync(lastOpened)) {
    const updatingFile = JSON.parse(fs.readFileSync(lastOpened, 'utf8'))
    updatingFile.content = fileContent

    fs.writeFile(lastOpened, JSON.stringify(updatingFile, null, 2), function writeJSON(err) {
      if (err) return console.log(err);
      console.log('File Content Written');
    });
  }else{

    //make new saveable file -> change lastOpened (in file) and here, then upload the file Content to it.

    //make user select new file
    //create file
    //create own const event such that
    
    const newFileStructure=
    {
      preferences:JSON.parse(JSON.stringify(preferences, null, 2)),
      content:JSON.parse(JSON.stringify(fileContent, null, 2))
    }

    //upload to the created new file

    //update lastOpened file with new created file

    //DONE FILE MANAGEMENT...
    
    
  }
  }
})

//changing font
ipcMain.handle('change-font', (event, openCode, fontStyle) => {
  if(openCode){
  //gets lastOpened
  lastOpened=checkLastOpened()

  if(fs.existsSync(lastOpened)) {
    const updatingFile = JSON.parse(fs.readFileSync(lastOpened, 'utf8'))
    updatingFile.preferences.fontStyle = fontStyle

    fs.writeFile(lastOpened, JSON.stringify(updatingFile, null, 2), function writeJSON(err) {
      if (err) return console.log(err);
      console.log('Changed Font to : ' , fontStyle);
    });

  }else{
    //if no file exists
  }
  }
})

//changing favorite
ipcMain.handle('change-favorite', (event, openCode, isFavorite) => {
  if(openCode){
  //gets lastOpened
  lastOpened=checkLastOpened()

  if(fs.existsSync(lastOpened)) {
    const updatingFile = JSON.parse(fs.readFileSync(lastOpened, 'utf8'))
    updatingFile.preferences.isFavorite = isFavorite

    fs.writeFile(lastOpened, JSON.stringify(updatingFile, null, 2), function writeJSON(err) {
      if (err) return console.log(err);
      console.log('Changed Favorite to : ' , isFavorite);
    });

  }else{
    //if no file exists
  }
  }
})

//changing name ------------------------------------------------------------------------------------


//changing spellcheck ------------------------------------------------------------------------------------
  
//on opening application
ipcMain.handle('open-application', (event, openingCode) => {
  if(openingCode){
    
    //gets lastOpened
    lastOpened=checkLastOpened()

    if(fs.existsSync(lastOpened)) {

      const lastOpenedResult = JSON.parse(fs.readFileSync(lastOpened, 'utf8'));
      return lastOpenedResult

    }else{

      return defaultFileStructure

    }
  }
})