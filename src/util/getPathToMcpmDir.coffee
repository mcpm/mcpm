path = require "path"
getUserSettingsDir = require "user-settings-dir"

module.exports = ->
	path.join getUserSettingsDir(), ".mcpm"
