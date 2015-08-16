winston = require "winston"
path = require "path"
fs = require "fs-extra"
util = require "../util"

add = ( pathToZip, manifest ) ->
	winston.verbose "cache.add: starting"

	pathToPackageCache = path.join util.getPathToMcpmDir(), "cache", manifest.name, manifest.version
	winston.silly "cache.add: pathToPackageCache:", pathToPackageCache

	manifestFilename = path.join pathToPackageCache, "mcpm-package.json"
	targetPathToZip = path.join pathToPackageCache, "mcpm-package.zip"

	if targetPathToZip is pathToZip
		winston.verbose "cache.add: trying to cache the cached zip itself, doing nothing"
		return

	fs.outputJsonSync manifestFilename, manifest
	winston.silly "cache.add: cached manifest"

	fs.copySync pathToZip, targetPathToZip
	winston.silly "cache.add: cached zip"

	winston.verbose "cache.add: success"
	return

module.exports = add
