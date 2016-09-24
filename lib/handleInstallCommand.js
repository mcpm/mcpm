let childProcess = require('child_process')
let getMinecraftPath = require('./util/getMinecraftPath')

module.exports = function invokeInstallExecutable (command, folderPath) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, {
      cwd: folderPath,
      env: {
        MCPM: '1',
        PATH_TO_MINECRAFT: getMinecraftPath()
      }
    }, error => {
      if (error) return reject(error)
      resolve()
    })
  })
}
