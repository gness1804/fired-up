const electron = require('electron')
const { remote } = electron
const mainProcess = remote.require('./main')
const { dialog } = mainProcess
const ipc = electron.ipcRenderer
const mockSessions = require('./mock-sessions-data')['New Session']
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

$('#load-storage-button').on('click', () => {
  getSessionsFromStorage()
})

const displayStoredSessionsOnPage = (targetSessions) => {
  $('#session-list-display').html('')
  for (const key in targetSessions) {
    if (targetSessions.hasOwnProperty(key)) {
      $('#session-list-display').append(`
        <h3
          id='session-name'
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

$('#clear-storage-button').on('click', () => {
  clearLocalStorage()
})

$('#session-list-display').on('click', '#session-name', (e) => {
  const keyString = e.target.innerText
  const lastId = sessions[keyString].length - 1
  const targetSession = sessions[keyString][lastId]
  $('#productivity-chart').html(renderSessionTable(targetSession))
})

const clearLocalStorage = () => {
  localStorage.removeItem('allSessions')
  $('#session-list-display').text('')
  mainProcess.clearSessionsArray()
  sessions = {}
}

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
    }
    return false
  }
  return true
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
  $('#productivity-chart').html('<canvas id="myChart" width="400" height="400"></canvas>')
  // renderSessionGraph(sessions[mostRecentSession.name])
  renderSessionGraph(mockSessions)
})

$('#table-button').on('click', () => {
  currentView = 'table'
  $('#productivity-chart').html(renderSessionTable(mostRecentSession))
})

let lsCounter = 0

// TODO change back to 60 for production
const displaySessionData = () => {
  lsCounter += 1

  if (lsCounter % 5 === 0) { // TODO change this back to 60 for production
    if (!sessions[mostRecentSession.name]) {
      sessions = Object.assign({}, sessions, {
        [mostRecentSession.name]: [],
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
      // renderSessionGraph(sessions[mostRecentSession.name])
      renderSessionGraph(mockSessions)
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
      <tr class='table-header'>
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

const renderSessionGraph = (graphData) => {
  const ctx = $('#myChart')

  const mostRecentSession = graphData.slice(-1)[0]
  const MRSAppObjects = mostRecentSession.applications
  const MRSAppNames = Object.keys(MRSAppObjects)
  const totalTime = MRSAppNames.reduce((totalTime, app) => (
    totalTime + MRSAppObjects[app].howManyTimesHit
  ), 0)
  const xAxis = []
  for (let i = 0; i < 10; i += 1) {
    const xInterval = totalTime / 10
    let label

    xInterval > 0 && xInterval < 60 && (label = `${xInterval * i} sec`)
    xInterval >= 60 && xInterval < Math.pow(60, 2) && (label = `${(xInterval * i) / 60} min`)
    xInterval >= 3600 && xInterval < Math.pow(60, 3) && (label = `${(xInterval * i) / Math.pow(60, 2)} hr`)

    xAxis.push(label)
  }

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
// x-axis -- total value of last session appplications how manytimeshit devided by 10 in an array
      labels: xAxis,
      // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
// Lines
      datasets: [
        {
// Line name
          label: 'Line Key',
// y-axis line value
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'Line Key 2',
          data: [15, 39, 40, 41, 56, 65, 40],
        },
      ],
    },
  })
}
