winston = require "winston"
getCurrentProfile = require "./getCurrentProfile"
setCurrentProfile = require "./setCurrentProfile"

addInstalledPackage = ( name, version, callback ) ->
	winston.verbose "util.addInstalledPackage: starting"
	currentProfile = getCurrentProfile().originalInfo
	winston.silly "util.addInstalledPackage: old profile",
		currentProfile
	currentProfile.mcpmInstalledPackages ?= {}
	currentProfile.mcpmInstalledPackages[ name ] = version
	winston.silly "util.addInstalledPackage: new profile",
		currentProfile
	winston.silly "util.addInstalledPackage: writing back to file"
	setCurrentProfile currentProfile
	winston.verbose "util.addInstalledPackage: success, " +
		"returning nothing"
	setTimeout ->
		callback undefined, yes

module.exports = addInstalledPackage
