install = require "./install"
util = require "./util"
winston = require "winston"

module.exports =

	install: ( packageString ) ->
		winston.verbose "mcpm.install: starting"
		parsed = install.parsePackageString packageString
		winston.silly "mcpm.install: parsed string:", parsed

		if parsed?.type is "folder"
			winston.silly "mcpm.install: installing as folder"
			install.fromFolder parsed.name
		else if parsed?.type is "zip"
			winston.silly "mcpm.install: installing as zip"
			install.fromZip parsed.name
		else
			winston.debug "mcpm.install: invalid package string, returning error"
			return new Error "Invalid package string!"

	getMinecraftVersion: ->
		winston.verbose "mcpm.getMinecraftVersion: starting"
		version = util.getCurrentProfile().version
		winston.verbose "mcpm.getMinecraftVersion: success:", version

		winston.silly "mcpm.getMinecraftVersion: returning version"
		version
