let fs = require('fs')
let tmp = require('tmp')
let AdmZip = require('adm-zip')
let installFromFolder = require('./fromFolder')
let cache = require('../cache')

function fromZip (pathToArchive) {
  if (!fs.statSync(pathToArchive).isFile()) {
    return new Error("Provided path doesn't point to a file!")
  }

  let zip
  try {
    zip = new AdmZip(pathToArchive)
  } catch (e) {
    return new Error(e)
  }

  if (!zip.getEntry('mcpm-package.json')) {
    return new Error("The archive doesn't have mcpm-package.json inside!")
  }

  let tempFolderPath = tmp.dirSync({ prefix: 'mcpm-' }).name

  let unzipResult
  try {
    unzipResult = zip.extractAllTo(tempFolderPath)
  } catch (e) {
    unzipResult = new Error(e)
  }

  if (unzipResult instanceof Error) {
    return new Error("Can't unzip the archive to a temp directory!")
  }

  let config = installFromFolder(tempFolderPath, pathToArchive)
  if (config instanceof Error) return config

  cache.add(pathToArchive, config)

  return config
}

module.exports = fromZip
