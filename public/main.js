const { app, BrowserWindow, ipcMain, shell  } = require('electron');

const fs = require("fs");
const os = require("os");
const path = require('path');

let mainWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        titleBarStyle:'hidden',
        fullscreen:false,
        minWidth: 920, minHeight: 610,
        width:920,
        height:610,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false,
            }
        }
    );
    mainWindow.loadURL('http://localhost:3000')

    ipcMain.on('message', (event, value)=>{
        console.log(value)
    })
});