let installFromZip = require('./fromZip')
let cache = require('../cache')

function fromCache (name, version) {
  let pathToZip = cache.get(name, version)

  if (pathToZip) {
    return installFromZip(pathToZip)
  } else {
    return new Error(`Can't find ${name}@${version} in cache!`)
  }
}

module.exports = fromCache
