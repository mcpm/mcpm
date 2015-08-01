fs = require "fs-extra"
path = require "path"
minecraftUtils = require "../minecraftUtils"
winston = require "winston"

copyFiles = ( list, packageDirectory, zipPath, config = {}) ->
	winston.verbose "install.copyFiles: starting"
	minecraftRoot = minecraftUtils.getMinecraftPath()
	winston.silly "install.copyFiles: got path to Minecraft root: " +
		minecraftRoot
	for to, fromList of list
		winston.verbose "install.copyFiles: next to: #{to}"
		for from in fromList
			winston.silly "install.copyFiles: next from: #{from}"
			if from is zipPath
				absoluteFrom = from
			else
				absoluteFrom = path.join packageDirectory, from
			winston.silly "install.copyFiles: absoluteFrom: #{absoluteFrom}"
			absoluteTo = path.join minecraftRoot, to, path.basename from
			winston.verbose "install.copyFiles: absoluteTo: #{absoluteTo}"
			fs.copySync absoluteFrom, absoluteTo
			winston.info "#{config.name}@#{config.version}: Copied " +
				"#{from} to #{to}"
	winston.verbose "install.copyFiles: finished copying"
	yes

module.exports = copyFiles
