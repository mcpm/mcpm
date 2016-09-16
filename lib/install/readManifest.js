let fs = require('fs-extra')
let path = require('path')
let winston = require('winston')

let readManifest = function (packageDirectory) {
  winston.verbose('install.readManifest: starting')

  try {
    winston.silly('install.readManifest: trying to read config')
    let configFilename = path.join(packageDirectory, 'mcpm-package.json')
    let result = fs.readFileSync(configFilename, {encoding: 'utf-8'})
    winston.verbose('install.readManifest: success, returning result')
    return result
  } catch (error) {
    winston.debug('install.readManifest: error, returning null')
    return null
  }
}

module.exports = readManifest
