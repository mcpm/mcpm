let winston = require('winston')
let path = require('path')
let fs = require('fs-extra')
let util = require('../util')

let add = function (pathToZip, manifest, callback) {
  winston.verbose('cache.add: starting')

  let pathToPackageCache = path.join(util.getPathToMcpmDir(), 'cache', manifest.name, manifest.version)
  winston.silly('cache.add: pathToPackageCache:', pathToPackageCache)

  let manifestFilename = path.join(pathToPackageCache, 'mcpm-package.json')
  let targetPathToZip = path.join(pathToPackageCache, 'mcpm-package.zip')

  if (targetPathToZip === pathToZip) {
    winston.verbose('cache.add: trying to cache the cached zip itself, doing nothing')
    setTimeout(() => callback(null))
    return
  }

  return fs.copy(pathToZip, targetPathToZip, function (err) {
    if (err) {
      callback(err)
      return
    }
    winston.silly('cache.add: cached zip')

    return fs.outputJson(manifestFilename, manifest, function (err) {
      if (err) {
        callback(err)
        return
      }
      winston.silly('cache.add: cached manifest')

      winston.verbose('cache.add: success')
      return callback(null)
    }
    )
  }
  )
}

module.exports = add
