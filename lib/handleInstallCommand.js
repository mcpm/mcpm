let childProcess = require('child_process')
let getMinecraftPath = require('./util/getMinecraftPath')
let _ = require('lodash')

module.exports = function invokeInstallExecutable (command, folderPath) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, {
      cwd: folderPath,
      env: _.defaults({
        MCPM: '1',
        PATH_TO_MINECRAFT: getMinecraftPath()
      }, process.env)
    }, error => {
      if (error) return reject(error)
      resolve()
    })
  })
}
