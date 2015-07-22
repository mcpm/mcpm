`#!/usr/bin/env node
`

commander = require "commander"
mcpm = require "../lib/mcpm"
minecraftUtils = require "../lib/minecraftUtils"

commander
	.version require( "../package.json" ).version

commander
	.command "install <packages...>"
	.alias "i"
	.description "install one or more packages"
	.action ( packages ) ->
		for pkg in packages
			console.log "Installing #{pkg}..."
			console.log mcpm.install pkg

commander
	.command "minecraft-version"
	.alias "mc"
	.description "display currently selected Minecraft version"
	.action ->
		console.log minecraftUtils.getCurrentProfile().version

commander
	.parse process.argv
