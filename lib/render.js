const electron = require('electron');
const { app, BrowserWindow, dialog, systemPreferences, remote } = electron;
const mainProcess = remote.require('./main');
const ipc = electron.ipcRenderer;

const $ = require('jquery')
const playButton = $('#play-button')
const pauseButton = $('#pause-button')
const stopButton = $('#stop-button')

// let activeSession = false;

playButton.on('click', () => {
  // activeSession = true
  mainProcess.makeActiveSessionTrue();
  mainProcess.activateSession()
  // console.log(activeSession);
})

pauseButton.on('click', () => {
  mainProcess.toggleActiveSession();
  // activeSession = activeSession ? false : true
  // console.log(activeSession);
})

stopButton.on('click', () => {
  mainProcess.makeActiveSessionFalse();
  // activeSession = false
  // console.log(activeSession);
})
