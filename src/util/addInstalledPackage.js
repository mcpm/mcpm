let winston = require('winston')
let getCurrentProfile = require('./getCurrentProfile')
let setCurrentProfile = require('./setCurrentProfile')

let addInstalledPackage = function (name, version, callback) {
  winston.verbose('util.addInstalledPackage: starting')
  let currentProfile = getCurrentProfile().originalInfo
  winston.silly('util.addInstalledPackage: old profile',
    currentProfile)
  if (currentProfile.mcpmInstalledPackages == null) { currentProfile.mcpmInstalledPackages = {} }
  currentProfile.mcpmInstalledPackages[ name ] = version
  winston.silly('util.addInstalledPackage: new profile',
    currentProfile)
  winston.silly('util.addInstalledPackage: writing back to file')
  setCurrentProfile(currentProfile)
  winston.verbose('util.addInstalledPackage: success, ' +
    'returning nothing'
  )
  return setTimeout(() => callback(undefined, true))
}

module.exports = addInstalledPackage
