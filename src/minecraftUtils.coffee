os = require "os"
path = require "path"
fs = require "fs"
winston = require "winston"

module.exports =
	getMinecraftPath: ->
		winston.verbose "minecraftUtils.getMinecraftPath: starting"
		homeDir = process.env.HOME
		winston.silly "minecraftUtils.getMinecraftPath: HOME: #{homeDir}"

		winston.silly "minecraftUtils.getMinecraftPath: os platform: " +
			os.platform()

		relativeMinecraftPath = switch os.platform()
			when "win32" then "AppData/Roaming/.minecraft"
			when "linux" then ".minecraft"
			when "darwin" then "Library/Application Support/minecraft"

		winston.silly "minecraftUtils.getMinecraftPath: " +
			"relativeMinecraftPath: #{relativeMinecraftPath}"

		result = path.join homeDir, relativeMinecraftPath
		winston.verbose "minecraftUtils.getMinecraftPath: result: #{result}"
		result

	getCurrentProfile: ->
		winston.verbose "minecraftUtils.getCurrentProfile: starting"
		pathToProfiles = path.join @getMinecraftPath(), "launcher_profiles.json"
		winston.silly "minecraftUtils.getCurrentProfile: #{pathToProfiles}"
		launcherProfiles = JSON.parse fs.readFileSync pathToProfiles,
			encoding: "utf-8"
		winston.silly "minecraftUtils.getCurrentProfile: parsed profiles"

		currentProfileName = launcherProfiles.selectedProfile
		currentProfile = launcherProfiles.profiles[ currentProfileName ]
		winston.silly "minecraftUtils.getCurrentProfile: current profile: ",
			currentProfile

		version = currentProfile.lastVersionId.split( "-" )[ 0 ]
		winston.silly "minecraftUtils.getCurrentProfile: version: #{version}"

		result =
			originalInfo: currentProfile
			installedPackages: currentProfile.mcpmInstalledPackages ? []
			version: version
		winston.verbose "minecraftUtils.getCurrentProfile: success", result
		result

	setCurrentProfile: ( newProfile ) ->
		winston.verbose "minecraftUtils.setCurrentProfile: starting"
		winston.silly "minecraftUtils.getCurrentProfile: new profile: ",
			newProfile
		pathToProfiles = path.join @getMinecraftPath(), "launcher_profiles.json"
		winston.silly "minecraftUtils.getCurrentProfile: #{pathToProfiles}"
		launcherProfiles = JSON.parse fs.readFileSync pathToProfiles,
			encoding: "utf-8"
		winston.silly "minecraftUtils.getCurrentProfile: parsed profiles"
		currentProfileName = launcherProfiles.selectedProfile

		launcherProfiles.profiles[ currentProfileName ] = newProfile

		winston.silly "minecraftUtils.getCurrentProfile: writing back to file"
		fs.writeFileSync pathToProfiles, JSON.stringify launcherProfiles, null, 2
		winston.verbose "minecraftUtils.getCurrentProfile: success, " +
			"returning nothing"
		return

	addInstalledPackage: ( name, version ) ->
		winston.verbose "minecraftUtils.addInstalledPackage: starting"
		currentProfile = @getCurrentProfile().originalInfo
		winston.silly "minecraftUtils.addInstalledPackage: old profile",
			currentProfile
		currentProfile.mcpmInstalledPackages[ name ] = version
		winston.silly "minecraftUtils.addInstalledPackage: new profile",
			currentProfile
		winston.silly "minecraftUtils.addInstalledPackage: writing back to file"
		@setCurrentProfile currentProfile
		winston.verbose "minecraftUtils.addInstalledPackage: success, " +
			"returning nothing"
		return
