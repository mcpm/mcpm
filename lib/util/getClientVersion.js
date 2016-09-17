let getCurrentProfile = require('./getCurrentProfile')

function getClientVersion (callback) {
  getCurrentProfile(profile => callback(profile.version))
}

module.exports = getClientVersion
