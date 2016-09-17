let winston = require('winston')
let fs = require('fs')
let tmp = require('tmp')
let AdmZip = require('adm-zip')
let installFromFolder = require('./fromFolder')
let cache = require('../cache')

let fromZip = function (pathToArchive) {
  winston.info(`${pathToArchive}: Installing from a zip...`)

  winston.verbose('install.fromZip: starting')
  let stats = fs.statSync(pathToArchive)

  if (!stats.isFile()) {
    winston.debug("install.fromZip: path doesn't point to a file, returning error")
    return new Error("Provided path doesn't point to a file!")
  }

  let zip
  try {
    zip = new AdmZip(pathToArchive)
  } catch (e) {
    winston.debug("install.fromZip: can't read zip, returning error")
    return new Error(e)
  }

  if (!zip.getEntry('mcpm-package.json')) {
    winston.debug('install.fromZip: no manifest inside, returning error')
    return new Error("The archive doesn't have mcpm-package.json inside!")
  }

  let tempFolderPath = tmp.dirSync({ prefix: 'mcpm-' }).name
  winston.verbose(`install.fromZip: temp dir: ${tempFolderPath}`)

  let unzipResult
  try {
    unzipResult = zip.extractAllTo(tempFolderPath)
  } catch (e) {
    unzipResult = new Error(e)
  }

  if (unzipResult instanceof Error) {
    winston.debug("install.fromZip: can't unzip, returning error", unzipResult)
    return new Error("Can't unzip the archive to a temp directory!")
  }

  winston.silly('install.fromZip: unziped, calling fromFolder')
  let config = installFromFolder(tempFolderPath, pathToArchive)

  if (config instanceof Error) {
    winston.debug('install.fromZip: error during installation, returning error', unzipResult)
    return config
  }

  cache.add(pathToArchive, config)
  winston.info(`${config.name}@${config.version}: Added to cache`)

  return config
}

module.exports = fromZip
