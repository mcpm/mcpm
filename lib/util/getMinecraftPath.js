let os = require('os')
let path = require('path')

let getMinecraftPath = function () {
  let homeDir = process.env.HOME

  switch (os.platform()) {
    case 'win32': return path.join(homeDir, 'AppData/Roaming/.minecraft')
    case 'linux': return path.join(homeDir, '.minecraft')
    case 'darwin': return path.join(homeDir, 'Library/Application Support/minecraft')
  }
}

module.exports = getMinecraftPath
