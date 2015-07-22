os = require "os"
path = require "path"
fs = require "fs"

module.exports =
	getMinecraftPath: ->
		homeDir = process.env.HOME

		relativeMinecraftPath = switch os.platform()
			when "win32" then "AppData/Roaming/.minecraft"
			when "linux" then ".minecraft"
			when "darwin" then "Library/Application Support/minecraft"

		path.join homeDir, relativeMinecraftPath

	getCurrentProfile: ->
		pathToProfiles = path.join @getMinecraftPath(), "launcher_profiles.json"
		launcherProfiles = JSON.parse fs.readFileSync pathToProfiles,
			encoding: "utf-8"

		currentProfileName = launcherProfiles.selectedProfile
		currentProfile = launcherProfiles.profiles[ currentProfileName ]

		version = currentProfile.lastVersionId.split( "-" )[ 0 ]

		originalInfo: currentProfile
		version: version
