const electron = require('electron');
const { app, BrowserWindow, dialog, systemPreferences, remote } = electron;
const fs = require('fs');
// const sessions = require('mock-session-data')
// console.log(sessions);

const menubar = require('menubar')
const monitor = require('active-window');

const mb = menubar({
  width: 800,
  icon: 'opts.dir + fire.png',
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
  //need to add function to stop active session and give user the data
  // console.log(activeSession)
}

const toggleActiveSession = () => {
  activeSession = !activeSession
  // console.log(activeSession)
}

callback = function(window){
  let app = window.app;
  try {
    if (!sessionData.hasOwnProperty(app)) {
      sessionData[app] = [];
      pushSessionItemIntoArray(app, rating = 'green');
    } else {
      pushSessionItemIntoArray(app, rating = 'green');
    }
    console.log('session data', sessionData);
  }catch(err) {
      console.log(err);
  }
}

const pushSessionItemIntoArray = (app, rating) => {
  sessionData[app].push({
    title: app,
    rating,
  });
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
});
