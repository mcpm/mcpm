fs = require "fs-extra"
path = require "path"
semver = require "semver"
glob = require "glob"
childProcess = require "child_process"
minecraftUtils = require "./minecraftUtils"

module.exports =

	parsePackageString: ( str ) ->
		if typeof str isnt "string"
			return null

		if str.startsWith "folder:"
			str = str.substring "folder:".length

		if str.includes ":"
			null
		else
			type: "folder"
			name: str

	readConfig: ( packageDirectory ) ->
		try
			configFilename = path.join packageDirectory, "mcpm-package.json"
			fs.readFileSync configFilename, encoding: "utf-8"
		catch
			null

	checkConfig: ( packageDirectory ) ->
		try
			config = JSON.parse @readConfig packageDirectory

		if not config
			return new SyntaxError "Invalid JSON in package config!"

		if not config.name or not /^[a-z]([\w-]*[a-z])?$/i.test config.name
			return new Error "Invalid package name!"

		if not semver.valid config.version
			return new Error "Invalid package version!"

		if not config.mc or not semver.validRange config.mc
			return new Error "Invalid package mc!"

		if not config.install_file_list and not config.install_executable
			return new Error "No install_file_list and install_executable!"

		if config.install_file_list and not Array.isArray config.install_file_list
			return new Error "Specified install_file_list is not an array!"

		true

	flattenFileList: ( list, packageDirectory ) ->
		if not packageDirectory
			return new Error "Package directory not specified!"

		flattened = {}

		for toWhere, fromGlob of list
			normalizedToWhere = path.posix.normalize toWhere

			if ( normalizedToWhere.startsWith ".." + path.sep ) or
			( normalizedToWhere is ".." )
				return new Error "Trying to copy to outside of Minecraft!"
			if path.isAbsolute normalizedToWhere
				return new Error "Trying to copy to an absolute path!"

			expandedGlob = glob.sync fromGlob, cwd: packageDirectory

			for filePath in expandedGlob
				normalizedFilePath = path.posix.normalize filePath

				if ( normalizedFilePath.startsWith ".." + path.sep ) or
				( normalizedFilePath is ".." )
					return new Error "Trying to copy from outside of the package!"
				if path.isAbsolute normalizedFilePath
					return new Error "Trying to copy from an absolute path!"

				flattened[ normalizedToWhere ] ?= []
				flattened[ normalizedToWhere ].push normalizedFilePath

		flattened

	copyFiles: ( list, packageDirectory ) ->
		minecraftRoot = minecraftUtils.getMinecraftPath()
		for to, fromList of list
			for from in fromList
				absoluteFrom = path.join packageDirectory, from
				absoluteTo = path.join minecraftRoot, to, path.basename from
				fs.copySync absoluteFrom, absoluteTo
		yes

	invokeInstallExecutable: ( file, packageDirectory ) ->
		normalizedFilePath = path.normalize file

		if ( normalizedFilePath.startsWith ".." + path.sep ) or
		( normalizedFilePath is ".." )
			return new Error "Trying to call a file outside of the package!"

		fullPath = path.normalize path.join packageDirectory, file

		childProcess.execFileSync fullPath, [],
			cwd: packageDirectory
			env:
				MCPM: "1"
				PATH_TO_MINECRAFT: minecraftUtils.getMinecraftPath()
