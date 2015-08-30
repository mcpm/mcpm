fs = require "fs-extra"
path = require "path"
util = require "../util"
async = require "async"
winston = require "winston"

copyFiles = ({ fileList, packageRoot, zipPath, callback }) ->
	winston.verbose "install.copyFiles: starting"
	minecraftRoot = util.getMinecraftPath()
	winston.silly "install.copyFiles: got path to Minecraft root: #{minecraftRoot}"
	async.forEachOfSeries fileList, ( fromList, to, doneList ) ->

		async.eachSeries fromList, ( from, doneOne ) ->
			winston.silly "install.copyFiles: next from: #{from}"
			if from is zipPath
				absoluteFrom = from
			else
				absoluteFrom = path.join packageRoot, from
			winston.silly "install.copyFiles: absoluteFrom: #{absoluteFrom}"
			absoluteTo = path.join minecraftRoot, to, path.basename from
			winston.verbose "install.copyFiles: absoluteTo: #{absoluteTo}"
			fs.copy absoluteFrom, absoluteTo, doneOne
		, ( err ) ->
			doneList err

	, ( err = null ) ->
		winston.verbose "install.copyFiles: finished copying"
		callback err

module.exports = copyFiles
