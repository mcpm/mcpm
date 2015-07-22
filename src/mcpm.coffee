install = require "./install"

module.exports =

	install: ( packageString ) ->
		parsed = install.parsePackageString packageString

		if parsed?.type is "folder"
			install.fromFolder parsed.name
		else
			return new Error "Invalid package string!"
