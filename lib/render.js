const electron = require('electron')
const { remote } = electron
const mainProcess = remote.require('./main')
const ipc = electron.ipcRenderer
const mockSession = require('./mock-session-data')

const $ = require('jquery')
const playButton = $('#play-button')
const pauseButton = $('#pause-button')
const stopButton = $('#stop-button')
const sessionNameInput = $('#session-name-input')
const sessionIntervalInput = $('#session-interval-input')
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

const displaySessionData = () => {
  $('#productivity-chart').html(renderSessionTable(mostRecentSession))
}

const renderSessionTable = (session) => (`
  <h2>${session.name}</h2>
  <table>
    <tbody>
      <tr class="table-header">
        <th>Application</th>
        <th>Time Allocation</th>
      </tr>
      ${renderTableRows(session)}
    </tbody>
  </table>
`)

const renderTableRows = (session) => {
  let tableRowsHTML = ''

  Object.keys(session.applications).forEach((appKey) => {
    tableRowsHTML += `
    <tr>
      <td>${appKey}</td>
      <td>${((session.applications[appKey].howManyTimesHit) * session.interval) / (60 * 60 * 1000)} Hours</td>
    </tr>
    `
  })

  return tableRowsHTML
}
