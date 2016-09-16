let winston = require('winston')
let semver = require('semver')
let path = require('path')
let fs = require('fs-extra')
let util = require('../util')

let get = function (name, version, callback) {
  if (!name || !/^[a-z]([\w-]*[a-z])?$/i.test(name)) {
    winston.debug('cache.get: invalid name, returning null')
    callback(new Error('Invalid package name!'))
    return
  }

  if (!semver.valid(version)) {
    winston.debug('cache.get: invalid version, returning null')
    callback(new Error('Invalid package version!'))
    return
  }

  let pathToMcpm = util.getPathToMcpmDir()
  let pathToZip = path.join(pathToMcpm, 'cache', name, version, 'mcpm-package.zip')
  return fs.exists(pathToZip, function (exists) {
    if (exists) {
      return callback(null, pathToZip)
    } else {
      return callback(new Error("Can't find specified package in the cache!"))
    }
  }
  )
}

module.exports = get
