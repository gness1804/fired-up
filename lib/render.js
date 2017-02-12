const electron = require('electron')
const { remote } = electron
const mainProcess = remote.require('./main')
const { dialog } = mainProcess
const ipc = electron.ipcRenderer
const mockSession = require('./mock-session-data')
const moment = require('moment')
const Chart = require('chart.js')
const $ = require('jquery')

const playButton = $('#play-button')
const pauseButton = $('#pause-button')
const stopButton = $('#stop-button')
const sessionNameInput = $('#session-name-input')
const submitSessionData = $('#submit-session-data')
const sessionListDisplay = $('#session-list-display')
const clearStorageButton = $('#clear-storage-button')

let mostRecentSession
let storedSessions
let name
let sessions = {}

// $('#load-storage-button').on('click', () => {
//   getSessionsFromStorage()
// })

const clearSessionListDisplay = () => {
  sessionListDisplay.html('')
}

const displayStoredSessionsOnPage = (sessions) => {
  clearSessionListDisplay()
  for (var key in sessions) {
    if (sessions.hasOwnProperty(key)) {
      sessionListDisplay.append(`
        <h3
          id="session-name"
        >
          ${key}
        </h3>
      `)
    }
  }
}

const getSessionsFromStorage = () => {
  if (JSON.parse(localStorage.getItem('allSessions'))) {
    storedSessions = JSON.parse(localStorage.getItem('allSessions'))
    displayStoredSessionsOnPage(storedSessions)
    sessions = storedSessions
  }
}

getSessionsFromStorage()

const clearLocalStorage = () => {
  localStorage.removeItem('allSessions')
  clearSessionListDisplay()
  mainProcess.clearSessionsArray()
  sessions = {}
}

clearStorageButton.on('click', () => {
  clearLocalStorage()
})

sessionListDisplay.on('click', '#session-name', (e) => {
  // const keyString = e.target.innerText
  const lastId = sessions[e.target.innerText].length - 1
  const targetSession = sessions[e.target.innerText][lastId]
  $('#productivity-chart').html(renderSessionTable(targetSession))
})

$('#session-name-input').on('change', () => {
  name = $('#session-name-input').val()
  mainProcess.setSessionNameByUser(name)
})

playButton.on('click', () => {
  if (!name) {
    dialog.showMessageBox({
      message: 'Error: you must enter a unique name for each session. Please enter a name and try again.',
    })
    return
  }
  if (!ensureNameIsOriginal()) {
    dialog.showMessageBox({
      message: 'Error: each session name must be original. Please choose a different name.',
    })
    return
  }
  mainProcess.startSession()
})

const ensureNameIsOriginal = () => {
  if (JSON.parse(localStorage.getItem('allSessions'))) {
    const names = Object.keys(JSON.parse(localStorage.getItem('allSessions')))
    const validate = names.filter((storedName) => {
      return name === storedName
    })
    if (validate.length === 0) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

pauseButton.on('click', () => {
  mainProcess.toggleActiveSession()
})

stopButton.on('click', () => {
  mainProcess.terminateSession(name)
  name = ''
  getSessionsFromStorage()
})

ipc.on('update-session-real-time', (event, data) => {
  mostRecentSession = data.data
  displaySessionData()
})

ipc.on('hide-session-name-input', (event, data) => {
  if (data.order === 'Hide Session Name') {
    $('#session-name-input').hide()
  }
})

ipc.on('show-session-name-input', (event, data) => {
  $('#session-name-input').val('')
  if (data.order === 'Show Session Name') {
    $('#session-name-input').show()
  }
})

let currentView = 'table'

$('#graph-button').on('click', () => {
  currentView = 'graph'
})

$('#table-button').on('click', () => {
  currentView = 'table'
})

let lsCounter = 0

// TODO change back to 60 for production
const displaySessionData = () => {
  ++lsCounter

  if (lsCounter % 5 === 0) {
    if (!sessions[mostRecentSession.name]) {
      sessions = Object.assign({}, sessions, {
        [mostRecentSession.name]: []
      })
    }

    sessions[mostRecentSession.name].push(mostRecentSession)

    localStorage.setItem('allSessions', JSON.stringify(sessions))
  }

  switch (currentView) {
    case 'table':
      $('#productivity-chart').html(renderSessionTable(mostRecentSession))
      break
    case 'graph':
      $('#productivity-chart').html('<canvas id="myChart" width="400" height="400"></canvas>')
      renderSessionGraph(sessions[mostRecentSession.name])
      break
    default:
      $('#productivity-chart').html(renderSessionTable(mostRecentSession))
  }
}

const renderSessionTable = (session) => (
  `
  <h2 id='table-title'>${session.name}</h2>
  <table>
    <thead>
      <tr class="table-header">
        <th class='key-header'>Application</th>
        <th class='time-header'>Time Allocation (HH:MM:SS)</th>
      </tr>
    </thead>
    <tbody>
      ${renderTableRows(session)}
    </tbody>
  </table>
`)

const renderTableRows = (session) => {
  let tableRowsHTML = ''

  const renderTime = (appKey) => {
    const durationInMS = (session.applications[appKey].howManyTimesHit) * session.interval

    return moment('2015-01-01').startOf('day')
      .milliseconds(durationInMS)
      .format('HH:mm:ss')
  }

  Object.keys(session.applications).forEach((appKey) => {
    tableRowsHTML += `
    <tr>
      <td class='table-key'>${appKey}</td>
      <td class='table-time'>${renderTime(appKey)}</td>
    </tr>
    `
  })

  return tableRowsHTML
}
