winston = require "winston"
fs = require "fs"
tmp = require "tmp"
AdmZip = require "adm-zip"
fromFolder = require "./fromFolder"

fromZip = ( pathToArchive ) ->
	winston.info "#{pathToArchive}: Installing from a zip..."

	winston.verbose "install.fromZip: starting"
	stats = fs.statSync pathToArchive

	if not stats.isFile()
		winston.debug "install.fromZip: path doesn't point to a file, returning error"
		return new Error "Provided path doesn't point to a file!"

	try
		zip = new AdmZip pathToArchive
	catch e
		winston.debug "install.fromZip: can't read zip, returning error"
		return new Error e

	if not zip.getEntry "mcpm-package.json"
		winston.debug "install.fromZip: no manifest inside, returning error"
		return new Error "The archive doesn't have mcpm-package.json inside!"

	tempFolderPath = tmp.dirSync( prefix: "mcpm-" ).name
	winston.verbose "install.fromZip: temp dir: #{tempFolderPath}"

	try
		unzipResult = zip.extractAllTo tempFolderPath
	catch e
		unzipResult = new Error e

	if unzipResult instanceof Error
		winston.debug "install.fromZip: can't unzip, returning error", unzipResult
		return new Error "Can't unzip the archive to a temp directory!"

	winston.silly "install.fromZip: unziped, calling fromFolder"
	fromFolder tempFolderPath, pathToArchive

module.exports = fromZip
