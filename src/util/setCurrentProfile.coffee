os = require "os"
path = require "path"
fs = require "fs"
winston = require "winston"

getMinecraftPath = require "./getMinecraftPath"

setCurrentProfile = ( newProfile ) ->
	winston.verbose "util.setCurrentProfile: starting"
	winston.silly "util.setCurrentProfile: new profile: ", newProfile

	pathToProfiles = path.join getMinecraftPath(), "launcher_profiles.json"
	winston.silly "util.setCurrentProfile: #{pathToProfiles}"

	launcherProfiles = JSON.parse fs.readFileSync pathToProfiles, encoding: "utf-8"
	winston.silly "util.setCurrentProfile: parsed profiles"

	currentProfileName = launcherProfiles.selectedProfile

	launcherProfiles.profiles[ currentProfileName ] = newProfile

	winston.silly "util.setCurrentProfile: writing back to file"
	fs.writeFileSync pathToProfiles, JSON.stringify launcherProfiles, null, 2

	winston.verbose "util.setCurrentProfile: success, returning nothing"
	return

module.exports = setCurrentProfile
