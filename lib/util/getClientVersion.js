let getCurrentProfile = require('./getCurrentProfile')

function getClientVersion (callback) {
  getCurrentProfile((_, profile) => callback(profile.version))
}

module.exports = getClientVersion
