winston = require "winston"
getCurrentProfile = require "./getCurrentProfile"

getClientVersion = ->
	winston.verbose "util.getClientVersion: starting"
	version = getCurrentProfile().version
	winston.verbose "util.getClientVersion: success:", version

	winston.silly "util.getClientVersion: returning version"
	version

module.exports = getClientVersion
