const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
var hbs = require('handlebars');
//require("./src/pollpartial.hbs")
//require("./src/optionpartial.hbs")

let partial = fs.readFileSync(path.resolve(__dirname, "./views/pollpartial.hbs"), 'utf-8');
hbs.registerPartial('pollpartial', partial);
let partial2 = fs.readFileSync(path.resolve(__dirname, "./views/optionpartial.hbs"), 'utf-8');
hbs.registerPartial('optionpartial', partial2);



async function refresh() {
  const MongoClient = require('mongodb').MongoClient; 
  const url = "mongodb+srv://appuser:37anypwD8H5kIbXu@cluster0.qnz1h.mongodb.net/?retryWrites=true&w=majority";
  const db = await MongoClient.connect(url);
  const dbo = db.db("pollAPP");
  const result = await dbo.collection("polls").find({}).toArray();
  //const jsonString = JSON.stringify(result);
  return result;
}

async function initialRefresh() {
  try {
      const res = await refresh();
      return res;
  } catch (error) {
      console.log(error);
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}


const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
    }
  });
  const src = await initialRefresh();
  // and load the index.html of the app.
  const template = hbs.compile(fs.readFileSync(path.resolve(__dirname, './index.hbs')).toString('utf8'));
  var context = { poll:src };
  const data = template(context);
  //console.log(data);
  fs.writeFileSync(path.resolve(__dirname, './index.html'), data);
  
  mainWindow.loadFile(path.resolve(__dirname, './index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

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
