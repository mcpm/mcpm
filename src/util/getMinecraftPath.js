os = require "os"
path = require "path"
winston = require "winston"

getMinecraftPath = ->
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

module.exports = getMinecraftPath
