let parsePackageString = require('./install/parsePackageString')
let fromFolder = require('./install/fromFolder')
let fromZip = require('./install/fromZip')
let fromCache = require('./install/fromCache')

function install (packageString) {
  let parsed = parsePackageString(packageString)

  switch ((parsed || {}).type) {
    case 'folder': return fromFolder(parsed.name)
    case 'zip': return fromZip(parsed.name)
    case 'cache': return fromCache(parsed.name, parsed.version)
    default: return Promise.reject(new Error('Invalid package string!'))
  }
}

module.exports = install
