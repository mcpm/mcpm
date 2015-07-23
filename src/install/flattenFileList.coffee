path = require "path"
glob = require "glob"
winston = require "winston"

flattenFileList = ( list, packageDirectory ) ->
	winston.verbose "install.flattenFileList: starting"
	if not packageDirectory
		winston.debug "install.flattenFileList: packageDirectory not" +
			"specified, returning error"
		return new Error "Package directory not specified!"
	winston.silly "install.flattenFileList: packageDirectory specified"

	winston.silly "install.flattenFileList: flattening glob list"
	flattenedGlobList = []
	for toWhere, fromGlob of list
		if Array.isArray fromGlob
			winston.silly "install.flattenFileList: flattening glob:", fromGlob
			for individualGlob in fromGlob
				flattenedGlobList.push [ toWhere, individualGlob ]
		else
			flattenedGlobList.push [ toWhere, fromGlob ]
	winston.silly "install.flattenFileList: flattened glob list"

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

			flattened[ normalizedToWhere ] ?= []
			flattened[ normalizedToWhere ].push normalizedFilePath
			winston.verbose "install.flattenFileList: added to the list: " +
				normalizedFilePath

	winston.silly "install.flattenFileList: flattened", flattened
	flattened

module.exports = flattenFileList
