let winston = require('winston')

let install = function (packageString) {
  winston.verbose('install: starting')
  let parsed = install.parsePackageString(packageString)
  winston.silly('install: parsed string:', parsed)

  if (__guard__(parsed, x => x.type) === 'folder') {
    winston.silly('install: installing as folder')
    return install.fromFolder(parsed.name)
  } else if (__guard__(parsed, x1 => x1.type) === 'zip') {
    winston.silly('install: installing as zip')
    return install.fromZip(parsed.name)
  } else if (__guard__(parsed, x2 => x2.type) === 'cache') {
    winston.silly('install: installing from cache')
    return install.fromCache(parsed.name, parsed.version)
  } else {
    winston.debug('install: invalid package string, returning error')
    return new Error('Invalid package string!')
  }
}

install.parsePackageString = require('./install/parsePackageString')
install.readManifest = require('./install/readManifest')
install.validateManifest = require('./install/validateManifest')
install.flattenFileList = require('./install/flattenFileList')
install.copyFiles = require('./install/copyFiles')
install.invokeInstallExecutable = require('./install/invokeInstallExecutable')
install.fromCache = require('./install/fromCache')
install.fromFolder = require('./install/fromFolder')
install.fromZip = require('./install/fromZip')

module.exports = install

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
