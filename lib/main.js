const electron = require('electron');
const { app, BrowserWindow, dialog, systemPreferences } = electron;
const fs = require('fs');

let mainWindow = null;

var monitor = require('active-window');

callback = function(window){
  console.log('window', window);
  try {
    console.log('window', window.window);
    console.log("App: " + window.app);
    console.log("Title: " + window.title);
  }catch(err) {
      console.log(err);
  }
}
/*Watch the active window
  @callback
  @number of requests; infinity = -1
  @interval between requests
*/
monitor.getActiveWindow(callback,-1, 1);

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
app.on('ready', () => {
  console.log('application is ready.');

  mainWindow = new BrowserWindow({
    maxWidth: 500,
    maxHeight: 300,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

// Object.assign(exports, {
//   openFile,
//   saveFile,
// });
