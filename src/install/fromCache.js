winston = require "winston"
installFromZip = require "./fromZip"
cache = require "../cache"

fromCache = ( name, version ) ->
	winston.verbose "install.fromCache: starting"

	pathToZip = cache.get name, version

	if pathToZip is null
		winston.debug "install.fromCache: can't find #{name}@#{version} in cache, returning error"
		new Error "Can't find #{name}@#{version} in cache!"
	else
		winston.debug "install.fromCache: delegating to install.fromZip"
		installFromZip pathToZip

module.exports = fromCache
