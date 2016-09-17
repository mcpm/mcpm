let path = require('path')
let childProcess = require('child_process')
let util = require('../util')

function invokeInstallExecutable (file, packageDirectory) {
  let normalizedFilePath = path.normalize(file)

  if ((normalizedFilePath.startsWith(`..${path.sep}`)) || (normalizedFilePath === '..')) {
    return new Error('Trying to call a file outside of the package!')
  }

  try {
    childProcess.execFileSync(normalizedFilePath, [], {
      cwd: packageDirectory,
      env: {
        MCPM: '1',
        PATH_TO_MINECRAFT: util.getMinecraftPath()
      }
    })
  } catch (err) {
    return err
  }

  return true
}

module.exports = invokeInstallExecutable
