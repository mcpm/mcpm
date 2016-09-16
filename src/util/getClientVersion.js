let winston = require('winston')
let getCurrentProfile = require('./getCurrentProfile')

let getClientVersion = function (callback) {
  winston.verbose('util.getClientVersion: starting')
  return getCurrentProfile(function (profile) {
    winston.verbose('util.getClientVersion: success:', profile.version)
    return callback(profile.version)
  })
}

module.exports = getClientVersion
