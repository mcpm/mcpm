let os = require('os')
let path = require('path')
let homeDir = require('home-dir').directory

let getMinecraftPath = function () {
  switch (os.platform()) {
    case 'win32': return path.join(homeDir, 'AppData/Roaming/.minecraft')
    case 'linux': return path.join(homeDir, '.minecraft')
    case 'darwin': return path.join(homeDir, 'Library/Application Support/minecraft')
  }
}

module.exports = getMinecraftPath
