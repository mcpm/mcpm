winston = require "winston"
path = require "path"
fs = require "fs-extra"
util = require "../util"

add = ( pathToZip, manifest, callback ) ->
	winston.verbose "cache.add: starting"

	pathToPackageCache = path.join util.getPathToMcpmDir(), "cache", manifest.name, manifest.version
	winston.silly "cache.add: pathToPackageCache:", pathToPackageCache

	manifestFilename = path.join pathToPackageCache, "mcpm-package.json"
	targetPathToZip = path.join pathToPackageCache, "mcpm-package.zip"

	if targetPathToZip is pathToZip
		winston.verbose "cache.add: trying to cache the cached zip itself, doing nothing"
		setTimeout ->
			callback null
		return

	fs.copy pathToZip, targetPathToZip, ( err ) ->
		if err
			callback err
			return
		winston.silly "cache.add: cached zip"

		fs.outputJson manifestFilename, manifest, ( err ) ->
			if err
				callback err
				return
			winston.silly "cache.add: cached manifest"

			winston.verbose "cache.add: success"
			callback null

module.exports = add
