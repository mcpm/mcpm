let winston = require('winston')
let installFromZip = require('./fromZip')
let cache = require('../cache')

let fromCache = function (name, version) {
  winston.verbose('install.fromCache: starting')

  let pathToZip = cache.get(name, version)

  if (pathToZip === null) {
    winston.debug(`install.fromCache: can't find ${name}@${version} in cache, returning error`)
    return new Error(`Can't find ${name}@${version} in cache!`)
  } else {
    winston.debug('install.fromCache: delegating to install.fromZip')
    return installFromZip(pathToZip)
  }
}

module.exports = fromCache
