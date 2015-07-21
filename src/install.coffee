fs = require "fs"
path = require "path"
semver = require "semver"

module.exports =

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

		for field in [ "name", "version", "mc" ]
			if not ( field of config )
				return new Error "Package config must include #{field} field!"

		if not /^[a-z]([a-z1-9-]*[a-z1-9])?$/i.test config.name
			return new Error "Invalid package name!"

		if not semver.valid config.version
			return new Error "Invalid package version!"

		if not config.mc or not semver.validRange config.mc
			return new Error "Invalid package mc!"

		true
