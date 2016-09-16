let winston = require('winston')

let parsePackageString = function (str) {
  winston.verbose('install.parsePackageString: starting')

  if (typeof str !== 'string') {
    winston.debug('install.parsePackageString: str is not a string, returning null')
    return null
  }

  if (str.includes('@')) {
    var version
    winston.verbose("install.parsePackageString: str contains '@', using type 'cache'")
    ;[str, version] = str.split('@')
    var detectedType = 'cache'
  }

  if (str.startsWith('zip:')) {
    winston.verbose("install.parsePackageString: str starts with 'zip', parsing as a zip")
    str = str.substring('zip:'.length)
    var detectedType = 'zip'
  } else if (str.endsWith('.zip')) {
    winston.verbose("install.parsePackageString: str ends with '.zip', parsing as a zip")
    var detectedType = 'zip'
  } else if (str.startsWith('folder:')) {
    winston.verbose("install.parsePackageString: str starts with 'folder', parsing as a folder")
    str = str.substring('folder:'.length)
    var detectedType = 'folder'
  }

  if (__guard__(str.match(/:/g), x => x.length) > 1) {
    winston.debug('install.parsePackageString: too many colons, returning null')
    return null
  }

  if (!detectedType) {
    winston.verbose("install.parsePackageString: using type 'folder' by default")
    var detectedType = 'folder'
  }

  return {
    type: detectedType,
    name: str,
  version}
}

module.exports = parsePackageString

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
