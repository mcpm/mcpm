os = require "os"
path = require "path"
fs = require "fs"
winston = require "winston"

module.exports =
	getMinecraftPath: ->
		winston.verbose "util.getMinecraftPath: starting"
		homeDir = process.env.HOME
		winston.silly "util.getMinecraftPath: HOME: #{homeDir}"

		winston.silly "util.getMinecraftPath: os platform: " +
			os.platform()

		relativeMinecraftPath = switch os.platform()
			when "win32" then "AppData/Roaming/.minecraft"
			when "linux" then ".minecraft"
			when "darwin" then "Library/Application Support/minecraft"

		winston.silly "util.getMinecraftPath: " +
			"relativeMinecraftPath: #{relativeMinecraftPath}"

		result = path.join homeDir, relativeMinecraftPath
		winston.verbose "util.getMinecraftPath: result: #{result}"
		result

	getCurrentProfile: ->
		winston.verbose "util.getCurrentProfile: starting"
		pathToProfiles = path.join @getMinecraftPath(), "launcher_profiles.json"
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

	setCurrentProfile: ( newProfile ) ->
		winston.verbose "util.setCurrentProfile: starting"
		winston.silly "util.getCurrentProfile: new profile: ",
			newProfile
		pathToProfiles = path.join @getMinecraftPath(), "launcher_profiles.json"
		winston.silly "util.getCurrentProfile: #{pathToProfiles}"
		launcherProfiles = JSON.parse fs.readFileSync pathToProfiles,
			encoding: "utf-8"
		winston.silly "util.getCurrentProfile: parsed profiles"
		currentProfileName = launcherProfiles.selectedProfile

		launcherProfiles.profiles[ currentProfileName ] = newProfile

		winston.silly "util.getCurrentProfile: writing back to file"
		fs.writeFileSync pathToProfiles, JSON.stringify launcherProfiles, null, 2
		winston.verbose "util.getCurrentProfile: success, " +
			"returning nothing"
		return

	addInstalledPackage: ( name, version ) ->
		winston.verbose "util.addInstalledPackage: starting"
		currentProfile = @getCurrentProfile().originalInfo
		winston.silly "util.addInstalledPackage: old profile",
			currentProfile
		currentProfile.mcpmInstalledPackages ?= {}
		currentProfile.mcpmInstalledPackages[ name ] = version
		winston.silly "util.addInstalledPackage: new profile",
			currentProfile
		winston.silly "util.addInstalledPackage: writing back to file"
		@setCurrentProfile currentProfile
		winston.verbose "util.addInstalledPackage: success, " +
			"returning nothing"
		return
