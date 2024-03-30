const { app, BrowserWindow, ipcMain, shell  } = require('electron');

const fs = require("fs");
const os = require("os");
const path = require('path');

let mainWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        frame:false,
        fullscreen:false,
        minWidth: 520, minHeight: 500,
        width:520,
        height:500,
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