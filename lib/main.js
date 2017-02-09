const electron = require('electron')
const realSessions = require('./real-session-data')
const sessionsArray = realSessions.realSessions

const menubar = require('menubar')
const monitor = require('active-window')

const mb = menubar({
  width: 800,
  height: 500,
  icon: './images/fire.png',
})

let activeSession = false
let applicationList
// user should be able to set this via input field
let interval

mb.on('ready', () => {
  console.log('App is ready')
})

mb.on('after-create-window', () => {
  mb.window.loadURL(`file://${__dirname}/index.html`)
})

const setSessionNameByUser = (name) => {
  console.log(name);
}

const startSession = () => {
  activeSession = true
  pushSessionIntoArray()
  mb.tray.setImage('./images/icon.png')
}

const pushSessionIntoArray = () => {
  sessionsArray.push({
    key: Date.now(),
    // name will be set by the user via input

    name: 'My Real Session',
    interval,
    applications: {},
  })
}

const terminateSession = () => {
  activeSession = false
  sendAllSessionsToRender()
  mb.tray.setImage('./images/fire.png')
}

const sendAllSessionsToRender = () => {
  mb.window.webContents.send('update-on-session-stop', {
    data: sessionsArray,
  })
}

const toggleActiveSession = () => {
  activeSession = !activeSession
}

callback = function (window) {
  const app = window.app

  try {
    const targetSession = sessionsArray[sessionsArray.length - 1]
    applicationList = targetSession.applications
    if (applicationList.hasOwnProperty(app)) {
      augmentAppHitCount(app)
    } else {
      instantiateNewApp(app)
    }
    sendMostRecentSessionToRender()
  } catch (err) {
    console.log(err)
  }
}

const augmentAppHitCount = (app) => {
  Object.assign(applicationList[app], {
    howManyTimesHit: applicationList[app].howManyTimesHit + 1,
  })
}

const instantiateNewApp = (app) => {
  applicationList[app] = {
    name: app,
    timeCount: interval,
    // rating will be set by user
    rating: 'green',
    howManyTimesHit: 1,
  }
}

const sendMostRecentSessionToRender = () => {
  mb.window.webContents.send('update-session-real-time', {
    data: sessionsArray[sessionsArray.length - 1],
  })
}

setInterval(() => {
  if (activeSession) {
    monitor.getActiveWindow(callback, 2, -2)
  }
}, interval)

Object.assign(exports, {
  startSession,
  terminateSession,
  toggleActiveSession,
  applicationList,
  setSessionNameByUser,
})
