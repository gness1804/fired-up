const electron = require('electron');
const { app, BrowserWindow, dialog, systemPreferences, remote } = electron;
const fs = require('fs');

const menubar = require('menubar')
const monitor = require('active-window');

const mb = menubar({
  width: 800
})

let mainWindow = null;

let activeSession = false;

const sessionData = {}

mb.on('ready', () => {
  console.log('App is ready');
});

mb.on('after-create-window', () => {
  mb.window.loadURL(`file://${__dirname}/index.html`);
});

const makeActiveSessionTrue = () => {
  activeSession = true
  // console.log(activeSession)
}

const makeActiveSessionFalse = () => {
  activeSession = false
  //add function to stop active session and give user the data
  // console.log(activeSession)
}

const toggleActiveSession = () => {
  activeSession = !activeSession
  // console.log(activeSession)
}

callback = function(window){
  let app = window.app;
  // console.log('window', window);
  try {
    // console.log('window', window.window);
    // console.log("App: " + window.app);
    // console.log("Title: " + window.title);
    if (!sessionData.hasOwnProperty(app)) {
      sessionData[app] = [];
      console.log(sessionData);
    }
  }catch(err) {
      console.log(err);
  }
}

setInterval(function () {
  if (activeSession) {
    monitor.getActiveWindow(callback, 2, -2);
  }
}, 2000);


Object.assign(exports, {
  makeActiveSessionTrue,
  makeActiveSessionFalse,
  toggleActiveSession,
  // activateSession,
});






// callback = function(window){
//   console.log('window', window);
//   try {
//     console.log('window', window.window);
//     console.log("App: " + window.app);
//     console.log("Title: " + window.title);
//   }catch(err) {
//       console.log(err);
//   }
// }
/*Watch the active window
  @callback
  @number of requests; infinity = -1
  @interval between requests
*/
// monitor.getActiveWindow(callback,-1, 1);

// If SessionActive > monitor.getActiveWindow is firing
// Instantiates object that logs instances of unique active applications
// Dynamically creates keys of unique application, values of array of logged instances (?)
// Stop session stops session









//Get the current active window
// monitor.getActiveWindow(callback);

// const openFile = () => {
//   const files = dialog.showOpenDialog(mainWindow, {
//     properties: ['openFile'],
//     filters: [
//       {
//         name: 'Markdown Files',
//         extensions: ['md', 'markdown', 'txt'],
//       }
//     ],
//   });
//   if (!files) {
//     return;
//   }
//   const file = files[0];
//   const content = fs.readFileSync(file).toString();
//   mainWindow.webContents.send('file-opened', file, content);
// };
//
// const saveFile = (content) => {
//   const fileName = dialog.showSaveDialog(mainWindow, {
//     title: 'Save HTML Output',
//     defaultPath: app.getPath('documents'),
//     filters: [
//       {
//         name: 'HTML Files',
//         extensions: ['html'],
//       }
//     ],
//   });
//   if (!fileName) {
//     return;
//   }
//   fs.writeFileSync(fileName, content);
// };
//
// app.on('ready', () => {
//   console.log('application is ready.');
//
//   mainWindow = new BrowserWindow({
//     maxWidth: 500,
//     maxHeight: 300,
//   });
//
//   mainWindow.loadURL(`file://${__dirname}/index.html`);
//
//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// });
