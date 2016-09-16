commander = require "commander"
winston = require "winston"
install = require "../lib/install"
util = require "../lib/util"

winston.setLevels winston.config.cli.levels
winston.cli()

verbosityLevels = [ "info", "debug", "verbose", "silly" ]
increaseVerbosity = ( v, total ) ->
	winston.level = verbosityLevels[ total ]
	total + ( total < verbosityLevels.length - 1 )

commander
	.version require( "../package.json" ).version
	.option "-v, --verbose", "increase verbosity", increaseVerbosity, 0

commander
	.command "install <packages...>"
	.alias "i"
	.description "install one or more packages"
	.action ( packages ) ->
		startProfile = util.getCurrentProfile()
		winston.info "Current Minecraft version: #{startProfile.version}"
		winston.info "Current profile name: #{startProfile.originalInfo.name}"
		console.log()

		for pkg in packages
			winston.info "#{pkg}: Deciding what to do..."
			result = install pkg
			if result instanceof Error
				winston.verbose "cli#install: error", result
				winston.error "#{pkg}: #{result.name}: #{result.message}",

		endProfile = util.getCurrentProfile()
		if ( endProfile.version isnt startProfile.version ) or
		( endProfile.originalInfo.name isnt startProfile.originalInfo.name )
			console.log()
			winston.info "Current Minecraft version: #{endProfile.version}"
			winston.info "Current profile name: #{endProfile.originalInfo.name}"

commander
	.command "minecraft-version"
	.alias "mc"
	.description "display currently selected Minecraft version"
	.action ->
		console.log util.getClientVersion()

commander.on "--help", ->
	console.log [
		"  Examples:"
		""
		"    Install a package from the ./foo directory"
		"      $ mcpm install ./foo"
		""
		"    Install a package from the ./foo.zip archive"
		"      $ mcpm install ./foo.zip"
		""
		"    Install a package from cache"
		"      $ mcpm install foo@0.2.0"
		""
		"    Show the Minecraft version of the currently selected profile"
		"      $ mcpm mc"
	].join "\n"

commander
	.parse process.argv
