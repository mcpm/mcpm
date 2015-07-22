fs = require "fs"
path = require "path"
semver = require "semver"

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
			return new SyntaxError

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
