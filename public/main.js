const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron/main');
const fs = require('node:fs')
const path = require('node:path');
const { PassThrough } = require('node:stream');

const folder = path.join(app.getPath('appData'), 'notely')
const recovery = path.join(folder, 'Recovery')
const settingPreferences = path.join(folder, 'SettingPreferences.json')

const settingStructure =
{ 
  lastOpened:null, //the file path
  filePaths:[
    'Files',
    'File 1',
    'File 2',
  ]
}

function checkFolders(){
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
  //might replace with open file -> so they can recover the file directly, the previous file will be asked to be 'saved'.
})

ipcMain.handle('delete-file', (event) => {
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  if(fs.existsSync(settingPrefParse.lastOpened)){ //checks file exists
    fs.unlinkSync(settingPrefParse.lastOpened) //deletes file
  }

  //remove from inbox
  if(settingPrefParse.filePaths.includes(settingPrefParse.lastOpened)){settingPrefParse.filePaths.splice(settingPrefParse.filePaths.indexOf(settingPrefParse.lastOpened), 1)} //remove from inbox
  settingPrefParse.lastOpened = null
  fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2)) //change last opened to null
  mainWindow.webContents.reloadIgnoringCache() //refresh application
})

ipcMain.handle('new-file', (event) => {
  //open new file
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  settingPrefParse.lastOpened = null
  fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2)) //change last opened to null
  mainWindow.webContents.reloadIgnoringCache() //refresh application
})

ipcMain.handle('open-file', (event) => {
  //open file (with notely extension)
  let openFile = dialog.showOpenDialogSync(mainWindow,{
    properties: ['openFile', 'openDirectory'],
    filters: [
      { name: 'Notely extension', extensions: ['json'] },
    ]
  })
  //check if valid file selected
  if(openFile){
    if(openFile[0]){
    let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

    //update last opened
    settingPrefParse.lastOpened = openFile[0]
    //add to inbox
    if(!settingPrefParse.filePaths.includes(openFile[0])){settingPrefParse.filePaths.push(openFile[0])}

    //updates setting file
    fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))
    mainWindow.webContents.reloadIgnoringCache() //refresh application
  }
}
})

ipcMain.handle('rename-file', (event) => {
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  let newFile = dialog.showSaveDialogSync(mainWindow,{
    properties: ['openFile', 'openDirectory'],
    filters: [
      { name: 'Notely extension', extensions: ['json'] },
    ]
  })
  if(newFile){
    console.log(newFile)

    fs.renameSync(settingPrefParse.lastOpened, newFile); //renames file

    //changes lastOpened
    settingPrefParse.lastOpened = newFile;
    //add to inbox
    if(!settingPrefParse.filePaths.includes(newFile)){settingPrefParse.filePaths.push(newFile)}
  
    //updates setting file
    fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2));
  }
})

//on open menu (gather data)
ipcMain.handle('get-menu-info', (event) => {
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  if(fs.existsSync(settingPrefParse.lastOpened)){
    //get the stats of current file
    let date = fs.statSync(settingPrefParse.lastOpened)
    let modifiedDate = `${date.mtime.getDate()}/${date.mtime.getMonth()}/${date.mtime.getFullYear()}`; //get modified date
    let createdDate = `${date.birthtime.getDate()}/${date.birthtime.getMonth()}/${date.birthtime.getFullYear()}`; //get created date
    return [true, modifiedDate, createdDate] //return [if file, modified date, created date]
  }else{
    return [false, null, null]
  }
})

//on inbox menu (gather data)
function gatherFiles(){
  const settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));
  const filePaths = settingPrefParse.filePaths

  console.log(filePaths)

  const newFilePaths = [] //later used to update filePaths
  const recentFiles = [] //array of files to return that are recently opened
  const favoriteFiles = [] //array of files to return with favorited files

  for (let i = 0; i < filePaths.length; i++) {
    if(fs.existsSync(filePaths[i])){
      const filePreferences = (JSON.parse(fs.readFileSync(filePaths[i], 'utf8'))); //get file preferences
      const fileStats = fs.statSync(filePaths[i]) //get file stats

      let fileStructure={
        recentId:`${fileStats.mtime.getTime()}`,

        author:filePreferences.preferences.author, name:filePreferences.preferences.name,
        path:filePaths[i], isFavorite:filePreferences.preferences.isFavorite,
        date:{
          modifiedDate:`${fileStats.mtime.getDate()}/${fileStats.mtime.getMonth()}/${fileStats.mtime.getFullYear()}`,
          createdDate:`${fileStats.birthtime.getDate()}/${fileStats.birthtime.getMonth()}/${fileStats.birthtime.getFullYear()}`
        }
      }

      if(filePreferences.preferences.isFavorite){favoriteFiles.push(fileStructure)} //add to array if isFavorite
      recentFiles.push(fileStructure)

      newFilePaths.push(filePaths[i]) //add to newFilePaths if file exists
    }
  }

  settingPrefParse.filePaths = newFilePaths;
  fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2)) //update setting file
  if(recentFiles.length>0){
    recentFiles.sort((a, b) => (b.recentId) - (a.recentId)) //sort files by date
    favoriteFiles.sort((a, b) => (b.recentId) - (a.recentId)) //sort files by date
  }

  return [recentFiles, favoriteFiles]
}

ipcMain.handle('get-inbox-info', (event) => {
  const result = gatherFiles()
  return result
})

//on save data
ipcMain.handle('save-data', (event, preferences, content) => {
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));
  let file={preferences:preferences, content:content}

  if(fs.existsSync(settingPrefParse.lastOpened)) {
    //save current file
    fs.writeFileSync(settingPrefParse.lastOpened, JSON.stringify(file, null, 2))
  }else{
    //save new file (filedialog)
    let newFile = dialog.showSaveDialogSync(mainWindow,{
      properties: ['openFile', 'openDirectory'],
      filters: [
        { name: 'Notely extension', extensions: ['json'] },
      ]
    })
    //check if valid file selected
    if(newFile){
      //writing new file
      fs.writeFileSync(newFile, JSON.stringify(file, null, 2))

      //updating lastOpened
      settingPrefParse.lastOpened = newFile
      //add to inbox
      if(!settingPrefParse.filePaths.includes(newFile)){settingPrefParse.filePaths.push(newFile)}

      //update setting file
      fs.writeFileSync(settingPreferences, JSON.stringify(settingPrefParse, null, 2))
    }
  }
})

//on opening application
ipcMain.handle('get-data', (event) => {
  let settingPrefParse = (JSON.parse(fs.readFileSync(settingPreferences, 'utf8')));

  if(fs.existsSync(settingPrefParse.lastOpened)) {
    let file = JSON.parse(fs.readFileSync(settingPrefParse.lastOpened, 'utf8'));
    let preferences = {preferences:file.preferences}; const content = file.content;
    return [preferences, content]
  }else{
    return [null, null]
  }
})