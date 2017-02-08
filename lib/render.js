const electron = require('electron');
const { app, BrowserWindow, dialog, systemPreferences, remote } = electron;
const mainProcess = remote.require('./main');
const ipc = electron.ipcRenderer;

const $ = require('jquery')
const playButton = $('#play-button')
const pauseButton = $('#pause-button')
const stopButton = $('#stop-button')

playButton.on('click', () => {
  mainProcess.makeActiveSessionTrue();
})

pauseButton.on('click', () => {
  mainProcess.toggleActiveSession();
})

stopButton.on('click', () => {
  mainProcess.makeActiveSessionFalse();
})

const session = remote.require('./mock-data/sessionObject')
$('document').ready(() => {
  $('.productivity-chart').html(renderSessionTable(session))
})

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
    tableRowsHTML = tableRowsHTML + `
    <tr>
      <td>${appKey}</td>
      <td>${((session.applications[appKey].count) * session.interval) / (60*60*1000)} Hours</td>
    </tr>
    `
  })

  return tableRowsHTML
}
