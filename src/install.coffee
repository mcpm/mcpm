winston = require "winston"

install = ( packageString ) ->
	winston.verbose "install: starting"
	parsed = install.parsePackageString packageString
	winston.silly "install: parsed string:", parsed

	if parsed?.type is "folder"
		winston.silly "install: installing as folder"
		install.fromFolder parsed.name
	else if parsed?.type is "zip"
		winston.silly "install: installing as zip"
		install.fromZip parsed.name
	else if parsed?.type is "cache"
		winston.silly "install: installing from cache"
		install.fromCache parsed.name, parsed.version
	else
		winston.debug "install: invalid package string, returning error"
		return new Error "Invalid package string!"

install.parsePackageString = require "./install/parsePackageString"
install.readManifest = require "./install/readManifest"
install.validateManifest = require "./install/validateManifest"
install.flattenFileList = require "./install/flattenFileList"
install.copyFiles = require "./install/copyFiles"
install.invokeInstallExecutable = require "./install/invokeInstallExecutable"
install.fromCache = require "./install/fromCache"
install.fromFolder = require "./install/fromFolder"
install.fromZip = require "./install/fromZip"

module.exports = install
