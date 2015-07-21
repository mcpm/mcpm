getMinecraftPath = ->
	os = require "os"
	path = require "path"

	homeDir = process.env.HOME

	relativeMinecraftPath = switch os.platform()
		when "win32" then "AppData/Roaming/.minecraft"
		when "linux" then ".minecraft"
		when "darwin" then "Library/Application Support/minecraft"

	path.join homeDir, relativeMinecraftPath

module.exports = {
	getMinecraftPath
}
