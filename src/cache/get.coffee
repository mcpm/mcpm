winston = require "winston"
semver = require "semver"
path = require "path"
fs = require "fs-extra"
util = require "../util"

get = ( name, version ) ->
	if not name or not /^[a-z]([\w-]*[a-z])?$/i.test name
		winston.debug "cache.get: invalid name, returning null"
		return null

	if not semver.valid version
		winston.debug "cache.get: invalid version, returning null"
		return null

	pathToMc = util.getPathToMcpmDir()
	pathToZip = path.join pathToMc, name, version, "mcpm-package.zip"
	if fs.existsSync pathToZip
		pathToZip
	else
		null

module.exports = get
