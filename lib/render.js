const electron = require('electron')
const { remote } = electron
const mainProcess = remote.require('./main')
const ipc = electron.ipcRenderer
const mockSession = require('./mock-session-data')

const $ = require('jquery')
const playButton = $('#play-button')
const pauseButton = $('#pause-button')
const stopButton = $('#stop-button')

let mostRecentSession
let allSessions

playButton.on('click', () => {
  mainProcess.makeActiveSessionTrue()
})

pauseButton.on('click', () => {
  mainProcess.toggleActiveSession()
})

stopButton.on('click', () => {
  mainProcess.makeActiveSessionFalse()
})

ipc.on('update-session-real-time', (event, data) => {
  console.log('real time data', data);
  mostRecentSession = data.data
  displaySessionData()
})

ipc.on('update-on-session-stop', (event, data) => {
  allSessions = data
  // iterate through array and put all sessions on the page; user can click on any of them to show it on the page
})

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
