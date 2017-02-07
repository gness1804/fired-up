const $ = require('jquery')
const playButton = $('#play-button')
const pauseButton = $('#pause-button')
const stopButton = $('#stop-button')

let activeSession = false;

playButton.on('click', () => {
  activeSession = true
  console.log(activeSession);
})

pauseButton.on('click', () => {
  activeSession = activeSession ? false : true
  console.log(activeSession);
})

stopButton.on('click', () => {
  activeSession = false
  console.log(activeSession);
})
