winston = require "winston"

parsePackageString = ( str ) ->
	winston.verbose "install.parsePackageString: starting"

	if typeof str isnt "string"
		winston.debug "install.parsePackageString: str is not a " +
			"string, returning null"
		return null

	if str.startsWith "folder:"
		winston.verbose "install.parsePackageString: str starts with " +
			"'folder', parsing as a folder"
		str = str.substring "folder:".length

	if str.match( /:/g )?.length > 1
		winston.debug "install.parsePackageString: str includes multiple " +
			"colons, returning null"
		null
	else
		winston.verbose "install.parsePackageString: str is a folder, " +
			"returning it with type 'folder'"
		type: "folder"
		name: str

module.exports = parsePackageString
