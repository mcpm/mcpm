os = require "os"
path = require "path"

module.exports =
	getMinecraftPath: ->
		homeDir = process.env.HOME

		relativeMinecraftPath = switch os.platform()
			when "win32" then "AppData/Roaming/.minecraft"
			when "linux" then ".minecraft"
			when "darwin" then "Library/Application Support/minecraft"

		path.join homeDir, relativeMinecraftPath

	getCurrentProfile: ->
		launcherProfiles = require path.join @getMinecraftPath(),
			"launcher_profiles.json"

		currentProfileName = launcherProfiles.selectedProfile
		currentProfile = launcherProfiles.profiles[ currentProfileName ]

		version = currentProfile.lastVersionId.split( "-" )[ 0 ]

		originalInfo: currentProfile
		version: version
