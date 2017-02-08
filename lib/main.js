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

mb.on('ready', () => {
  console.log('App is ready');
});

mb.on('after-create-window', () => {
  mb.window.loadURL(`file://${__dirname}/index.html`);
});

const makeActiveSessionTrue = () => {
console.log("test");
}

Object.assign(exports, {
  makeActiveSessionTrue,
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
