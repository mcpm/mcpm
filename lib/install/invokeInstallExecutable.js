let path = require('path')
let childProcess = require('child_process')
let winston = require('winston')
let util = require('../util')

let invokeInstallExecutable = function (file, packageDirectory) {
  winston.verbose('install.invokeInstallExecutable: starting')
  let normalizedFilePath = path.normalize(file)
  winston.silly('install.invokeInstallExecutable: normalizedFilePath:' +
    normalizedFilePath
  )

  if ((normalizedFilePath.startsWith(`..${path.sep}`)) ||
    (normalizedFilePath === '..')) {
    winston.debug('install.invokeInstallExecutable: trying to call a ' +
      'file outside of the package, returning error'
    )
    return new Error('Trying to call a file outside of the package!')
  }

  try {
    winston.silly('install.invokeInstallExecutable: trying to exec')
    var result = childProcess.execFileSync(file, [], {
      cwd: packageDirectory,
      env: {
        MCPM: '1',
        PATH_TO_MINECRAFT: util.getMinecraftPath()
      }
    }
    )
  } catch (err) {
    winston.debug('install.invokeInstallExecutable: failed, ' +
      'returning error'
    )
    return err
  }
  winston.verbose('install.invokeInstallExecutable: exited', result)

  winston.verbose('install.invokeInstallExecutable: success, returning ' +
    'true'
  )
  return true
}

module.exports = invokeInstallExecutable
