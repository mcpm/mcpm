fs = require "fs-extra"
path = require "path"
semver = require "semver"
glob = require "glob"
childProcess = require "child_process"
minecraftUtils = require "./minecraftUtils"
winston = require "winston"

module.exports =

	parsePackageString: require "./install/parsePackageString"
	readConfig: require "./install/readConfig"
	checkConfig: require "./install/checkConfig"

	flattenFileList: ( list, packageDirectory ) ->
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

	copyFiles: ( list, packageDirectory, config = {}) ->
		winston.verbose "install.copyFiles: starting"
		minecraftRoot = minecraftUtils.getMinecraftPath()
		winston.silly "install.copyFiles: got path to Minecraft root: " +
			minecraftRoot
		for to, fromList of list
			winston.verbose "install.copyFiles: next to: #{to}"
			for from in fromList
				winston.silly "install.copyFiles: next from: #{from}"
				absoluteFrom = path.join packageDirectory, from
				winston.silly "install.copyFiles: absoluteFrom: #{absoluteFrom}"
				absoluteTo = path.join minecraftRoot, to, path.basename from
				winston.verbose "install.copyFiles: absoluteTo: #{absoluteTo}"
				fs.copySync absoluteFrom, absoluteTo
				winston.info "#{config.name}@#{config.version}: Copied " +
					"#{from} to #{to}"
		winston.verbose "install.copyFiles: finished copying"
		yes

	invokeInstallExecutable: ( file, packageDirectory ) ->
		winston.verbose "install.invokeInstallExecutable: starting"
		normalizedFilePath = path.normalize file
		winston.silly "install.invokeInstallExecutable: normalizedFilePath:" +
			normalizedFilePath

		if ( normalizedFilePath.startsWith ".." + path.sep ) or
		( normalizedFilePath is ".." )
			winston.debug "install.invokeInstallExecutable: trying to call a " +
				"file outside of the package, returning error"
			return new Error "Trying to call a file outside of the package!"

		fullPath = path.normalize path.join packageDirectory, file
		winston.verbose "install.invokeInstallExecutable: fullPath: #{fullPath}"

		try
			winston.silly "install.invokeInstallExecutable: trying to exec"
			result = childProcess.spawnSync fullPath, [],
				cwd: packageDirectory
				env:
					MCPM: "1"
					PATH_TO_MINECRAFT: minecraftUtils.getMinecraftPath()
		catch err
			winston.debug "install.invokeInstallExecutable: failed, " +
				"returning error"
			return err
		winston.verbose "install.invokeInstallExecutable: exited", result

		winston.verbose "install.invokeInstallExecutable: success, returning " +
			"true"
		true

	fromFolder: ( packageDirectory ) ->
		winston.verbose "install.fromFolder: starting"
		config = @checkConfig packageDirectory
		winston.silly "install.fromFolder: checked config", config

		if config instanceof Error
			winston.debug "install.fromFolder: invalid config, returning error"
			return config

		winston.info "#{config.name}@#{config.version}: Installing from " +
			"a folder..."

		if config.install_file_list
			winston.silly "install.fromFolder: found install_file_list"
			winston.verbose "install.fromFolder: flattening list"
			list = @flattenFileList config.install_file_list, packageDirectory
			winston.silly "install.fromFolder: flattened list", list
			if list instanceof Error
				winston.debug "install.fromFolder: error while flattening, " +
					"returning error"
				return list

			winston.debug "install.fromFolder: copying files"
			result = @copyFiles list, packageDirectory, config
			winston.silly "install.fromFolder: copied files", result
			if result instanceof Error
				winston.debug "install.fromFolder: error while copying, " +
					"returning error"
				return result

		if config.install_executable
			winston.silly "install.fromFolder: found install_executable"
			winston.info "#{config.name}@#{config.version}: Calling " +
				"#{config.install_executable}..."
			winston.debug "install.fromFolder: invoking install executable"
			result = @invokeInstallExecutable config.install_executable,
				packageDirectory
			winston.silly "install.fromFolder: invoked", result

			if result instanceof Error
				winston.debug "install.fromFolder: install executable " +
					"failed, returning error"
				return result

		winston.debug "install.fromFolder: adding installed package to profile"
		result = minecraftUtils.addInstalledPackage config.name, config.version

		profile = minecraftUtils.getCurrentProfile()
		winston.info "#{config.name}@#{config.version}: Success!"
		winston.verbose "install.fromFolder: done, returning result"
		result
