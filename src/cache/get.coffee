winston = require "winston"
semver = require "semver"
path = require "path"
fs = require "fs-extra"
util = require "../util"

get = ( name, version ) ->
	if name and semver.valid version
		pathToMc = util.getPathToMcpmDir()
		pathToZip = path.join pathToMc, name, version, "mcpm-package.zip"
		if fs.existsSync pathToZip
			pathToZip
		else
			null
	else
		null

module.exports = get
