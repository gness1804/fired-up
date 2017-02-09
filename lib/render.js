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
  mostRecentSession = data.data
  displaySessionData()
})

ipc.on('update-on-session-stop', (event, data) => {
  console.log('sessions data', data);
});

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

  // console.log('session', session)

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
