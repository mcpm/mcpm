winston = require "winston"
path = require "path"
fs = require "fs-extra"
util = require "../util"

add = ( pathToZip, manifest ) ->
	winston.verbose "cache.add: starting"

	pathToPackageCache = path.join util.getPathToMcpmDir(), "cache", manifest.name, manifest.version
	winston.silly "cache.add: pathToPackageCache:", pathToPackageCache

	manifestFilename = path.join pathToPackageCache, "mcpm-package.json"
	fs.outputJsonSync manifestFilename, manifest
	winston.silly "cache.add: cached manifest"

	fs.copySync pathToZip, path.join pathToPackageCache, "mcpm-package.zip"
	winston.silly "cache.add: cached zip"

	winston.verbose "cache.add: success"
	return

module.exports = add
