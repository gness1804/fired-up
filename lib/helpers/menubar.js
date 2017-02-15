const menubar = require('menubar')
const electron = require('electron')
const { systemPreferences } = electron

let icon = 'images/fire.png'

if (systemPreferences.isDarkMode()) {
  icon = './images/fire-white.png'
}

const mb = menubar({
  width: 500,
  height: 500,
  icon,
})

module.exports = mb
