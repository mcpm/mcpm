`#!/usr/bin/env node
`

commander = require "commander"
winston = require "winston"
mcpm = require "../lib/mcpm"

commander
	.version require( "../package.json" ).version

commander
	.command "install <packages...>"
	.alias "i"
	.description "install one or more packages"
	.action ( packages ) ->
		for pkg in packages
			winston.info "#{pkg}: Searching..."
			result = mcpm.install pkg
			if result instanceof Error
				winston.error "#{pkg}: #{result.name}: #{result.message}"

commander
	.command "minecraft-version"
	.alias "mc"
	.description "display currently selected Minecraft version"
	.action ->
		console.log mcpm.getMinecraftVersion()

commander
	.parse process.argv
