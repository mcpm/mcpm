fs = require "fs-extra"
path = require "path"
winston = require "winston"

readConfig = ( packageDirectory ) ->
	winston.verbose "install.readConfig: starting"

	try
		winston.silly "install.readConfig: trying to read config"
		configFilename = path.join packageDirectory, "mcpm-package.json"
		result = fs.readFileSync configFilename, encoding: "utf-8"
		winston.verbose "install.readConfig: success, returning result"
		result
	catch
		winston.debug "install.readConfig: error, returning null"
		null

module.exports = readConfig
