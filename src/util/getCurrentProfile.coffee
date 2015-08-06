os = require "os"
path = require "path"
fs = require "fs"
winston = require "winston"

getMinecraftPath = require "./getMinecraftPath"

getCurrentProfile = ->
	winston.verbose "util.getCurrentProfile: starting"
	pathToProfiles = path.join getMinecraftPath(), "launcher_profiles.json"
	winston.silly "util.getCurrentProfile: #{pathToProfiles}"
	launcherProfiles = JSON.parse fs.readFileSync pathToProfiles,
		encoding: "utf-8"
	winston.silly "util.getCurrentProfile: parsed profiles"

	currentProfileName = launcherProfiles.selectedProfile
	currentProfile = launcherProfiles.profiles[ currentProfileName ]
	winston.silly "util.getCurrentProfile: current profile: ",
		currentProfile

	version = currentProfile.lastVersionId.split( "-" )[ 0 ]
	winston.silly "util.getCurrentProfile: raw version: #{version}"

	if /^\d+\.\d+$/.test version
		winston.silly "util.getCurrentProfile: adding " +
			"'.0' to the version"
		version += ".0"

	result =
		originalInfo: currentProfile
		installedPackages: currentProfile.mcpmInstalledPackages ? []
		version: version
	winston.verbose "util.getCurrentProfile: success", result
	result

module.exports = getCurrentProfile
