`#!/usr/bin/env node
`

commander = require "commander"
winston = require "winston"
mcpm = require "../lib/mcpm"
minecraftUtils = require "../lib/minecraftUtils"

winston.setLevels winston.config.cli.levels
winston.cli()

verbosityLevels = [ "info", "debug", "verbose", "silly" ]
increaseVerbosity = ( v, total ) ->
	winston.level = verbosityLevels[ total ]
	total + ( total < verbosityLevels.length - 1 )

commander
	.version require( "../package.json" ).version
	.option "-v, --verbose", "Increase verbosity", increaseVerbosity, 0

commander
	.command "install <packages...>"
	.alias "i"
	.description "install one or more packages"
	.action ( packages ) ->
		startProfile = minecraftUtils.getCurrentProfile()
		winston.info "Current Minecraft version: #{startProfile.version}"
		winston.info "Current profile name: #{startProfile.originalInfo.name}"
		console.log()

		for pkg in packages
			winston.info "#{pkg}: Deciding what to do..."
			result = mcpm.install pkg
			if result instanceof Error
				winston.verbose "cli#install: error", result
				winston.error "#{pkg}: #{result.name}: #{result.message}",

		endProfile = minecraftUtils.getCurrentProfile()
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
		console.log mcpm.getMinecraftVersion()

commander
	.parse process.argv
