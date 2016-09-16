let os = require('os')
let path = require('path')
let winston = require('winston')

let getMinecraftPath = function () {
  winston.verbose('util.getMinecraftPath: starting')
  let homeDir = process.env.HOME
  winston.silly(`util.getMinecraftPath: HOME: ${homeDir}`)

  winston.silly('util.getMinecraftPath: os platform: ' +
    os.platform()
  )

  let relativeMinecraftPath = (() => {
    switch (os.platform()) {
      case 'win32':
        return 'AppData/Roaming/.minecraft'
      case 'linux':
        return '.minecraft'
      case 'darwin':
        return 'Library/Application Support/minecraft'
    }})()

  winston.silly('util.getMinecraftPath: ' +
    `relativeMinecraftPath: ${relativeMinecraftPath}`
  )

  let result = path.join(homeDir, relativeMinecraftPath)
  winston.verbose(`util.getMinecraftPath: result: ${result}`)
  return result
}

module.exports = getMinecraftPath
