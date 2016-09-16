winston = require "winston"
getCurrentProfile = require "./getCurrentProfile"

getClientVersion = ( callback ) ->
	winston.verbose "util.getClientVersion: starting"
	getCurrentProfile ( profile ) ->
		winston.verbose "util.getClientVersion: success:", profile.version
		callback profile.version

module.exports = getClientVersion
