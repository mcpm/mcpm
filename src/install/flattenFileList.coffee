path = require "path"
glob = require "glob"
winston = require "winston"

flattenGlobList = ( globList ) ->
	winston.silly "install.flattenFileList: flattening glob list"
	flattenedGlobList = []
	for toWhere, fromGlob of globList
		if Array.isArray fromGlob
			winston.silly "install.flattenFileList: flattening glob:", fromGlob
			for individualGlob in fromGlob
				flattenedGlobList.push [ toWhere, individualGlob ]
		else
			flattenedGlobList.push [ toWhere, fromGlob ]
	winston.silly "install.flattenFileList: flattened glob list"
	flattenedGlobList

globToFileList = ( fromGlob, packageDirectory ) ->
	fileList = []

	expandedGlob = glob.sync fromGlob, cwd: packageDirectory
	winston.silly "install.flattenFileList: expanded glob", expandedGlob

	for filePath in expandedGlob
		winston.silly "install.flattenFileList: next path", filePath
		normalizedFilePath = path.posix.normalize filePath
		winston.silly "install.flattenFileList: normalized: " +
			normalizedFilePath

		if ( normalizedFilePath.startsWith ".." + path.sep ) or
		( normalizedFilePath is ".." )
			winston.debug "install.flattenFileList: trying to copy " +
				"from outside of the package, returning error"
			return new Error "Trying to copy from outside of the package!"
		if path.isAbsolute normalizedFilePath
			winston.debug "install.flattenFileList: trying to copy " +
				"from an absolute path, returning error"
			return new Error "Trying to copy from an absolute path!"

		fileList.push normalizedFilePath
		winston.verbose "install.flattenFileList: added to the list: " +
			normalizedFilePath

	fileList

flattenFileList = ( list, packageDirectory ) ->
	winston.verbose "install.flattenFileList: starting"

	if not packageDirectory
		winston.debug "install.flattenFileList: packageDirectory not" +
			"specified, returning error"
		return new Error "Package directory not specified!"
	winston.silly "install.flattenFileList: packageDirectory specified"

	flattenedGlobList = flattenGlobList list

	flattened = {}

	for [ toWhere, fromGlob ] in flattenedGlobList
		winston.verbose "install.flattenFileList: next glob",
			{ toWhere, fromGlob }
		normalizedToWhere = path.posix.normalize toWhere
		winston.silly "install.flattenFileList: normalizedToWhere: " +
			normalizedToWhere

		if ( normalizedToWhere.startsWith ".." + path.sep ) or
		( normalizedToWhere is ".." )
			winston.debug "install.flattenFileList: trying to copy to " +
				"outside of Minecraft, returning error"
			return new Error "Trying to copy to outside of Minecraft!"
		if path.isAbsolute normalizedToWhere
			winston.debug "install.flattenFileList: trying to copy to " +
				"an absolute path, returning error"
			return new Error "Trying to copy to an absolute path!"

		fileList = globToFileList fromGlob, packageDirectory
		if fileList instanceof Error
			return fileList

		flattened[ normalizedToWhere ] ?= []
		flattened[ normalizedToWhere ] = flattened[ normalizedToWhere ].concat fileList

	winston.silly "install.flattenFileList: flattened", flattened
	flattened

module.exports = flattenFileList
