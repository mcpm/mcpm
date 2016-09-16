winston = require "winston"

parsePackageString = ( str ) ->
	winston.verbose "install.parsePackageString: starting"

	if typeof str isnt "string"
		winston.debug "install.parsePackageString: str is not a string, returning null"
		return null

	if str.includes "@"
		winston.verbose "install.parsePackageString: str contains '@', using type 'cache'"
		[ str, version ] = str.split "@"
		detectedType = "cache"

	if str.startsWith "zip:"
		winston.verbose "install.parsePackageString: str starts with 'zip', parsing as a zip"
		str = str.substring "zip:".length
		detectedType = "zip"

	else if str.endsWith ".zip"
		winston.verbose "install.parsePackageString: str ends with '.zip', parsing as a zip"
		detectedType = "zip"

	else if str.startsWith "folder:"
		winston.verbose "install.parsePackageString: str starts with 'folder', parsing as a folder"
		str = str.substring "folder:".length
		detectedType = "folder"

	if str.match( /:/g )?.length > 1
		winston.debug "install.parsePackageString: too many colons, returning null"
		return null

	if not detectedType
		winston.verbose "install.parsePackageString: using type 'folder' by default"
		detectedType = "folder"

	type: detectedType
	name: str
	version: version

module.exports = parsePackageString
