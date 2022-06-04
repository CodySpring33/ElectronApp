const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
let bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://appuser:37anypwD8H5kIbXu@cluster0.qnz1h.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
  if (err) throw err;
  var dbo = db.db("pollAPP");
  dbo.collection("polls").find({}).toArray( function(err, result) {
    if (err) throw err;
    const jsonString = JSON.stringify(result)
    fs.writeFileSync('./polls.json', jsonString)
    db.close();
  });
}); 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
