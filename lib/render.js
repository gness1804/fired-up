const electron = require('electron');
const { app, BrowserWindow, dialog, systemPreferences, remote } = electron;
const mainProcess = remote.require('./main');
const ipc = electron.ipcRenderer;

const $ = require('jquery')
const playButton = $('#play-button')
const pauseButton = $('#pause-button')
const stopButton = $('#stop-button')

let mostRecentSession;

playButton.on('click', () => {
  mainProcess.makeActiveSessionTrue();
})

pauseButton.on('click', () => {
  mainProcess.toggleActiveSession();
})

stopButton.on('click', () => {
  mainProcess.makeActiveSessionFalse();
})

ipc.on('session-ended', (event, data) => {
  mostRecentSession = data.data;
  displaySessionData();
});

const displaySessionData = () => {
  console.log(mostRecentSession);
}
