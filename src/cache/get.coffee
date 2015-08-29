winston = require "winston"
semver = require "semver"
path = require "path"
fs = require "fs-extra"
util = require "../util"

get = ( name, version, callback ) ->
	if not name or not /^[a-z]([\w-]*[a-z])?$/i.test name
		winston.debug "cache.get: invalid name, returning null"
		callback new Error "Invalid package name!"
		return

	if not semver.valid version
		winston.debug "cache.get: invalid version, returning null"
		callback new Error "Invalid package version!"
		return

	pathToMcpm = util.getPathToMcpmDir()
	pathToZip = path.join pathToMcpm, "cache", name, version, "mcpm-package.zip"
	fs.exists pathToZip, ( exists ) ->
		if exists
			callback null, pathToZip
		else
			callback new Error "Can't find specified package in the cache!"

module.exports = get
