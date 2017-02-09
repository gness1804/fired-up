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

$('#storage-button').on('click', () => {
  getSessionsFromStorage()
})

const getSessionsFromStorage = () => {
  storedSessions = JSON.parse(localStorage.getItem('allSessions'))

  console.log('sessions from storage', storedSessions)
}

submitSessionData.on('click', () => {
  const name = sessionNameInput.val()
  mainProcess.setSessionNameByUser(name)
  sessionNameInput.val('')
})

playButton.on('click', () => {
  mainProcess.startSession()
})

pauseButton.on('click', () => {
  mainProcess.toggleActiveSession()
})

stopButton.on('click', () => {
  mainProcess.terminateSession()
})

ipc.on('update-session-real-time', (event, data) => {
  mostRecentSession = data.data
  displaySessionData()
})

ipc.on('update-on-session-stop', (event, data) => {
  sendAllSessionsToStorage(data)
  // iterate through array and put all sessions on the page; user can click on any of them to show it on the page
})

const sendAllSessionsToStorage = (data) => {
  localStorage.setItem('allSessions', JSON.stringify(data))
}

let currentView = 'table'

$('#graph-button').on('click', () => {
  currentView = 'graph'
})

$('#table-button').on('click', () => {
  currentView = 'table'
})

const displaySessionData = () => {
  switch (currentView) {
    case 'table':
      $('#productivity-chart').html(renderSessionTable(mostRecentSession))
      break
    case 'graph':
      $('#productivity-chart').html(renderSessionGraph(mostRecentSession))
      break
    default:
      $('#productivity-chart').html(renderSessionTable(mostRecentSession))
  }
}

const renderSessionTable = (session) => (`
  <h2>${session.name}</h2>
  <table>
    <tbody>
      <tr class="table-header">
        <th>Application</th>
        <th>Time Allocation (HH:MM:SS)</th>
      </tr>
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
      <td>${appKey}</td>
      <td>${renderTime(appKey)}</td>
    </tr>
    `
  })

  return tableRowsHTML
}

const renderSessionGraph = (session) => {
  
}
