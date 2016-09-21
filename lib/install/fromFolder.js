let winston = require('winston')
let addInstalledPackage = require('../util/addInstalledPackage')
let validateManifest = require('./validateManifest')
let flattenFileList = require('./flattenFileList')
let copyFiles = require('./copyFiles')
let invokeInstallExecutable = require('./invokeInstallExecutable')

function fromFolder (packageDirectory, zipPath) {
  let config = validateManifest(packageDirectory)
  if (config instanceof Error) return config

  winston.info(`${config.name}@${config.version}: Installing...`)

  if (config.install_file_list) {
    let list = flattenFileList(config.install_file_list, packageDirectory, zipPath)
    if (list instanceof Error) return list

    let result = copyFiles(list, packageDirectory, zipPath, config)
    if (result instanceof Error) return result
  }

  if (config.install_executable) {
    winston.info(`${config.name}@${config.version}: Calling ${config.install_executable}...`)

    let result = invokeInstallExecutable(config.install_executable, packageDirectory)
    if (result instanceof Error) return result
  }

  let result = addInstalledPackage(config.name, config.version)
  if (result instanceof Error) return result

  return config
}

module.exports = fromFolder
