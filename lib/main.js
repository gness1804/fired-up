const electron = require('electron');
const { app, BrowserWindow, dialog, systemPreferences, remote } = electron;
const fs = require('fs');
const mockSessions = require('./mock-session-data')
const realSessions = require('./real-session-data')
const sessionsArray = realSessions.realSessions

const menubar = require('menubar')
const monitor = require('active-window');

const mb = menubar({
  width: 800,
  // icon: 'opts.dir + fire.png',
})

let mainWindow = null;
let activeSession = false;
let currentSessionName;
let finalizedSession;
//user should be able to set this via input field
let interval = 2000;

mb.on('ready', () => {
  console.log('App is ready');
});

mb.on('after-create-window', () => {
  mb.window.loadURL(`file://${__dirname}/index.html`);
});

const makeActiveSessionTrue = () => {
  activeSession = true
  sessionsArray.push({
    key: Date.now(),
    //name will be set by the user via input
    name: 'My Real Session',
    interval,
    applications: {},
  })
  //this will also be set by the user
  currentSessionName = 'My Real Session'
  // console.log(sessionsArray)
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

const findTargetSession = () => {
  return sessionsArray.filter((session) => {
      return session.name === currentSessionName
    })
}

callback = function(window){
  let app = window.app;
  try {
    let targetSession = findTargetSession()
    let applicationList = targetSession[0].applications
    if (applicationList.hasOwnProperty(app)) {
      Object.assign(applicationList[app], {
        howManyTimesHit: applicationList[app].howManyTimesHit + 1
      })
    } else {
      applicationList[app] = {
        name: app,
        timeCount: interval,
        //rating will be set by user
        rating: 'green',
        howManyTimesHit: 1,
      }
    }
    console.log(applicationList);
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
}, interval);


Object.assign(exports, {
  makeActiveSessionTrue,
  makeActiveSessionFalse,
  toggleActiveSession,
});
