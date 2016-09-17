let getCurrentProfile = require('./getCurrentProfile')
let setCurrentProfile = require('./setCurrentProfile')

function addInstalledPackage (name, version, callback) {
  let currentProfile = getCurrentProfile().originalInfo
  currentProfile.mcpmInstalledPackages = currentProfile.mcpmInstalledPackages || {}
  currentProfile.mcpmInstalledPackages[ name ] = version
  setCurrentProfile(currentProfile)
  callback(undefined, true)
}

module.exports = addInstalledPackage
