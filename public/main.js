const { app, BrowserWindow, ipcMain, shell, screen  } = require('electron/main');
const fs = require('node:fs')
const path = require('node:path')

const folder = path.join(app.getPath('appData'), 'notely')
const recovery = path.join(folder, 'Recovery')
const settingPreferences = path.join(folder, 'SettingPreferences.json')

var lastOpened = null //current last opened

//setting structure (handles last opened file and all file paths initiated)
const settingStructure =
{ 
  lastOpened:null, //the file path
  files:{
      path:null,
    }
}

//default file structure (handles null factored files, or -> default editor settings (unsaved file))
const defaultFileStructure =
{
  preferences:
    {
      name:'Untitled',
      isFavorite:false,
      date:{
        updatedLast:null,
        createdDate:null,
      },
      fontStyle:'Pt Sans',
      spellCheck:true,
    },
  content:{
    //content of editor
  }
}

const checkFolders=()=>{
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder), (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Directory :: Notely Created~');
    };
  }
  if (!fs.existsSync(recovery)) {
    fs.mkdirSync(recovery), (err) => {
      if (err) {
          console.log(err);
      }
      console.log('Directory :: Recovery Created~');
    };
  }
  if (!fs.existsSync(settingPreferences)) {
    fs.writeFileSync(settingPreferences, JSON.stringify(settingStructure, null, 2), (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File :: Setting Preferences Created~");
      }
    });
  }
  const settingPreferencesResult = JSON.parse(fs.readFileSync(settingPreferences, 'utf8'));
  lastOpened = settingPreferencesResult.lastOpened
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

//Open Recovery
ipcMain.handle('open-recovery', (event, openCode) => {
  if(openCode){
    shell.openPath(recovery)
  }
})

//Saving File
ipcMain.handle('upload-to-file', (event, fileContent) => {
  console.log(fileContent)
  //working -> to upload to file.
})

//Opening Application
ipcMain.handle('open-application', (event, openingCode) => {
  if(openingCode){
    if(fs.existsSync(lastOpened)) {
      const lastOpenedResult = JSON.parse(fs.readFileSync(lastOpened, 'utf8'));
      return lastOpenedResult
    }else{
      return defaultFileStructure
    }
  }
})