const electron = require('electron')
const { remote } = electron
const mainProcess = remote.require('./main')
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

let mostRecentSession
let storedSessions
let name
let sessions = {}

// $('#load-storage-button').on('click', () => {
//   getSessionsFromStorage()
// })

const displayStoredSessionsOnPage = (sessions) => {
  $('#session-list-display').html('')
  for (var key in sessions) {
    if (sessions.hasOwnProperty(key)) {
      $('#session-list-display').append(`
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
  storedSessions = JSON.parse(localStorage.getItem('allSessions'))
  displayStoredSessionsOnPage(storedSessions)
  sessions = storedSessions
}

getSessionsFromStorage()

$('#clear-storage-button').on('click', () => {
  clearLocalStorage()
})

$('#session-list-display').on('click', '#session-name', (e) => {
  console.log('value of sessions in click event', sessions)
  const keyString = e.target.innerText
  console.log('keyString', keyString)
  const lastId = sessions[keyString].length - 1
  const targetSession = sessions[keyString][lastId]
  $('#productivity-chart').html(renderSessionTable(targetSession))
})

const clearLocalStorage = () => {
  localStorage.removeItem('allSessions')
}

$('#session-name-input').on('change', () => {
  name = $('#session-name-input').val()
  mainProcess.setSessionNameByUser(name)
})

playButton.on('click', () => {
  mainProcess.startSession()
})

pauseButton.on('click', () => {
  mainProcess.toggleActiveSession()
})

stopButton.on('click', () => {
  mainProcess.terminateSession(name)
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

    localStorage.setItem('allSessions', JSON.stringify(sessions));
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
