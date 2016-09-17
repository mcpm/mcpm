let winston = require('winston')
let util = require('../util')
let validateManifest = require('./validateManifest')
let flattenFileList = require('./flattenFileList')
let copyFiles = require('./copyFiles')
let invokeInstallExecutable = require('./invokeInstallExecutable')

let fromFolder = function (packageDirectory, zipPath) {
  winston.verbose('install.fromFolder: starting')
  let config = validateManifest(packageDirectory)
  winston.silly('install.fromFolder: checked config', config)

  if (config instanceof Error) {
    winston.debug('install.fromFolder: invalid config, returning error')
    return config
  }

  if (!zipPath) {
    winston.info(`${config.name}@${config.version}: Installing from a folder...`)
  } else {
    winston.info(`${config.name}@${config.version}: Unpacked, installing...`)
  }

  if (config.install_file_list) {
    winston.silly('install.fromFolder: found install_file_list')
    winston.verbose('install.fromFolder: flattening list')
    let list = flattenFileList(config.install_file_list, packageDirectory, zipPath)
    winston.silly('install.fromFolder: flattened list', list)
    if (list instanceof Error) {
      winston.debug('install.fromFolder: error while flattening, returning error')
      return list
    }

    winston.debug('install.fromFolder: copying files')
    let result = copyFiles(list, packageDirectory, zipPath, config)
    winston.silly('install.fromFolder: copied files', result)
    if (result instanceof Error) {
      winston.debug('install.fromFolder: error while copying, returning error')
      return result
    }
  }

  if (config.install_executable) {
    winston.silly('install.fromFolder: found install_executable')
    winston.info(`${config.name}@${config.version}: Calling ${config.install_executable}...`)
    winston.debug('install.fromFolder: invoking install executable')
    let result = invokeInstallExecutable(config.install_executable,
      packageDirectory)
    winston.silly('install.fromFolder: invoked', result)

    if (result instanceof Error) {
      winston.debug('install.fromFolder: install executable failed, returning error')
      return result
    }
  }

  winston.debug('install.fromFolder: adding installed package to profile')
  let result = util.addInstalledPackage(config.name, config.version)

  if (result instanceof Error) {
    winston.debug("install.fromFolder: can't add to the installed list, returning error")
    return result
  }

  winston.info(`${config.name}@${config.version}: Success!`)
  winston.verbose('install.fromFolder: done, returning config')
  return config
}

module.exports = fromFolder
