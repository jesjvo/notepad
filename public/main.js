const { app, BrowserWindow, ipcMain, shell  } = require('electron');

const fs = require("fs");
const os = require("os");
const path = require('path');

let mainWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        frame:false,
        fullscreen:false,
        minWidth: 380, minHeight: 320,
        width:380,
        height:320,
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