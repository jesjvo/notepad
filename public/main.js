const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron/main'); // electron
const fs = require('node:fs') // file system
const path = require('node:path'); // file path

const folder = path.join(app.getPath('appData'), 'Enotely') // Enotely folder
const settingPreferences = path.join(folder, 'SettingPreferences.json') // setting file

const settingStructure =
{ 
  lastOpened:null, // the last opened file path
  filePaths:[
    // file paths
  ]
}

function checkFolders(){ // check if folders exist
  if (!fs.existsSync(folder)) {fs.mkdirSync(folder)} // Enotely folder
  if (!fs.existsSync(settingPreferences)) {fs.writeFileSync(settingPreferences, JSON.stringify(settingStructure, null, 2))} // setting file
}

checkFolders() // check if folders exist

let mainWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        frame:false, // remove title bar
        icon: `file://${path.join(__dirname, '../build/main.ico')}`,
        minWidth: 380, minHeight: 320, // minimum size
        webPreferences: { 
            nodeIntegration:false, // disable node integration
            contextIsolation:true, // context isolation
            sandbox:true,
            preload: path.join(__dirname, 'preload.js'), // preload.js
            webSecurity:true,
            allowRunningInsecureContent: false,
            experimentalFeatures: false,
            }
        }
    );

    //show devtools
    //mainWindow.webContents.openDevTools()

    mainWindow.loadURL(
      //isDev
      /*'http://localhost:3000'*/
      `file://${path.join(__dirname, '../build/index.html')}`)
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

/* Update Last Opened and File Paths */
function updateLastOpened(filePaths, filePath){ //file path array from settingPrefParse, file path of file intending to move to first index

  if(filePaths.includes(filePath)){
    filePaths.sort(function(x,y){ return x == filePath ? -1 : y == filePath ? 1 : 0; }); //true, move file path to 1st index
  }else{
    filePaths.unshift(filePath) //add file path to first index in file paths
  }

  return [filePaths, filePath] //new file path list, (changed filePath to 1st index)
}

//Exit Application
ipcMain.handle('exit-application', (event) => {
  app.quit()
})

//Open Folder
ipcMain.handle('open-folder', (event) => {
  shell.openPath(folder)
})

//Refresh Application
ipcMain.handle('refresh-application', (event) => {
  mainWindow.webContents.reloadIgnoringCache()
})

/* Open File (from inbox) */
ipcMain.handle('open-inbox-file', (event, filePath) => {

  //check if file exists
  if(fs.existsSync(filePath)){

  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //updates lastOpened file and filePaths
  const updatedSetting = updateLastOpened(settingPrefParse.filePaths, filePath)
  settingPrefParse.filePaths = updatedSetting[0]
  settingPrefParse.lastOpened = updatedSetting[1]

  //update settingPreferences file
  fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))

  //refresh application
  mainWindow.webContents.reloadIgnoringCache()
  }
})

/* Open File */
ipcMain.handle('open-file', (event) => {
  
  //open a new file using dialog
  let openFile = dialog.showOpenDialogSync(mainWindow,{
    properties: ['openFile', 'openDirectory'],
    filters: [
      { name: 'Enotely extension', extensions: ['json'] },
    ]
  })

  //check if any file is selected
  if(openFile){

    //get the 1st selected file
    if(openFile[0]){

      //get settingPreference file content
      let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

      //update lastOpened file and filePaths
      const updatedSetting = updateLastOpened(settingPrefParse.filePaths, openFile[0])
      settingPrefParse.filePaths = updatedSetting[0]
      settingPrefParse.lastOpened = updatedSetting[1]

      //update settingPreferences file
      fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))

      //refresh application
      mainWindow.webContents.reloadIgnoringCache()
    }
  }
})

/* Delete File */
ipcMain.handle('delete-file', (event) => {
  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //delete lastOpened file
  if(fs.existsSync(settingPrefParse.lastOpened)){fs.unlinkSync(settingPrefParse.lastOpened)}

  //if lastOpened file was in filePaths, remove it
  if(settingPrefParse.filePaths.includes(settingPrefParse.lastOpened)){
    settingPrefParse.filePaths.splice(settingPrefParse.filePaths.indexOf(settingPrefParse.lastOpened), 1)
  }
  //change lastOpened to null
  settingPrefParse.lastOpened = null

  //update settingPreferences file
  fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))
  
  //refresh application
  mainWindow.webContents.reloadIgnoringCache()
})

/* New File */
ipcMain.handle('new-file', (event) => {
  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //change lastOpened to null
  settingPrefParse.lastOpened = null

  //update settingPreferences file
  fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))

  //refresh application
  mainWindow.webContents.reloadIgnoringCache()
})

/* Rename File */
ipcMain.handle('rename-file', (event) => {

  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //rename a file using dialog
  let newFile = dialog.showSaveDialogSync(mainWindow,{
    properties: ['openFile', 'openDirectory'],
    filters: [
      { name: 'Enotely extension', extensions: ['json'] },
    ]
  })

  //check if any file is selected
  if(newFile){

    //rename file
    fs.renameSync(settingPrefParse.lastOpened, newFile)

    //updates lastOpened file and filePaths
    const updatedSetting = updateLastOpened(settingPrefParse.filePaths, newFile)
    settingPrefParse.filePaths = updatedSetting[0]
    settingPrefParse.lastOpened = updatedSetting[1]
  
    //update settingPreferences file
    fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2));
  }
})

/* Save Data */
ipcMain.handle('save-data', (event, preferences, content) => {

  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //create fileContent object
  let fileContent={preferences:preferences, content:content}

  //check if lastOpened file exists
  if(fs.existsSync(settingPrefParse.lastOpened)) {

    //update lastOpened file (save)
    fs.writeFileSync(settingPrefParse.lastOpened, JSON.stringify(fileContent, null, 2))
  }else{

    //save new file using dialog
    let newFile = dialog.showSaveDialogSync(mainWindow,{
      properties: ['openFile', 'openDirectory'],
      filters: [
        { name: 'Enotely extension', extensions: ['json'] },
      ]
    })

    //check if any file is selected
    if(newFile){

      //save file new file selected
      fs.writeFileSync(newFile, JSON.stringify(fileContent, null, 2))

      //updates lastOpened file and filePaths
      const updatedSetting = updateLastOpened(settingPrefParse.filePaths, newFile)
      settingPrefParse.filePaths = updatedSetting[0]
      settingPrefParse.lastOpened = updatedSetting[1]

      //update settingPreferences file
      fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))
    }
  }
})


/* Gather Files (Inbox) */
ipcMain.handle('get-inbox-info', (event) => {

  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //establish filePaths from settingPreferences
  let filePaths = settingPrefParse.filePaths

  //check if lastOpened file exists, if it does, set it to currentFile
  let currentFile=null
  if(fs.existsSync(settingPrefParse.lastOpened)){currentFile = settingPrefParse.lastOpened}

  //newFilePaths is used to update setting file (check for invalid files)
  //create arrays for recentFiles, favoriteFiles
  const newFilePaths = []
  const recentFiles = []
  const favoriteFiles = []

  for (let i = 0; i < filePaths.length; i++) {

    //check if file in filePaths exists
    if(fs.existsSync(filePaths[i])){

      //add filePath to newFilePaths
      newFilePaths.push(filePaths[i])

      //get selected file from filePaths preferences
      const filePreferences = (JSON.parse(fs.readFileSync(filePaths[i], 'utf8')));

      //create fileData object, includes filePath and preferences
      let fileData={
        filePath:filePaths[i],
        preferences:filePreferences.preferences,
      }

      //add to recent file array
      recentFiles.push(fileData)

      //if file is favorited, add it to favoriteFiles array
      if(filePreferences.preferences.isFavorite){favoriteFiles.push(fileData)}
    }
  }

  //update filePaths in settingPreferences file
  settingPrefParse.filePaths = newFilePaths;

  //update settingPreferences file
  fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))

  //return array of recentFiles, favoriteFiles and currentFile
  return [recentFiles, favoriteFiles, currentFile]
})


/* Get Menu Information */
ipcMain.handle('get-menu-info', (event) => {

  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //check if lastOpened file exists
  if(fs.existsSync(settingPrefParse.lastOpened)){

    //get modified and created date of lastOpened file
    let date = fs.statSync(settingPrefParse.lastOpened)
    let modifiedDate = `${date.mtime.getDate()}/${date.mtime.getMonth()}/${date.mtime.getFullYear()}`;
    let createdDate = `${date.birthtime.getDate()}/${date.birthtime.getMonth()}/${date.birthtime.getFullYear()}`;

    //return [if file, modified date, created date]
    return [true, modifiedDate, createdDate]
  }else{

    //return null for all since lastOpened file does not exist
    return [false, null, null]
  }
})


/* Get Data (starting application) */
ipcMain.handle('get-data', (event) => {

  //get settingPreference file content
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  //check if lastOpened file exists
  if(fs.existsSync(settingPrefParse.lastOpened)) {

    //get lastOpened file content
    let file = JSON.parse(fs.readFileSync(settingPrefParse.lastOpened, 'utf8'));
    let preferences = {preferences:file.preferences}; const content = file.content;

    //return lastOpened preferences and content
    return [preferences, content]

  }else{

    //return null for all since lastOpened file does not exist
    return [null, null]
  }
})