os = require "os"
path = require "path"
fs = require "fs"
winston = require "winston"

getMinecraftPath = require "./getMinecraftPath"

getCurrentProfile = ( callback ) ->
	winston.verbose "util.getCurrentProfile: starting"
	pathToProfiles = path.join getMinecraftPath(), "launcher_profiles.json"
	winston.silly "util.getCurrentProfile: #{pathToProfiles}"
	fs.readFile pathToProfiles, { encoding: "utf-8" }, ( err, rawContent ) ->
		launcherProfiles = JSON.parse rawContent
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

		setTimeout ->
			callback undefined, result

module.exports = getCurrentProfile
