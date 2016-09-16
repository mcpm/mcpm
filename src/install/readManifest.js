fs = require "fs-extra"
path = require "path"
winston = require "winston"

readManifest = ( packageDirectory ) ->
	winston.verbose "install.readManifest: starting"

	try
		winston.silly "install.readManifest: trying to read config"
		configFilename = path.join packageDirectory, "mcpm-package.json"
		result = fs.readFileSync configFilename, encoding: "utf-8"
		winston.verbose "install.readManifest: success, returning result"
		result
	catch
		winston.debug "install.readManifest: error, returning null"
		null

module.exports = readManifest
