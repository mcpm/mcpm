semver = require "semver"
winston = require "winston"
readConfig = require "./readConfig"

checkConfig = ( packageDirectory ) ->
	winston.verbose "install.checkConfig: starting"

	try
		winston.silly "install.checkConfig: parsing config"
		config = JSON.parse readConfig packageDirectory

	winston.silly "install.checkConfig: finished parsing"

	if not config
		winston.debug "install.checkConfig: no config, returning error"
		return new SyntaxError "Invalid JSON in package config!"
	winston.silly "install.checkConfig: JSON was valid"

	if not config.name or not /^[a-z]([\w-]*[a-z])?$/i.test config.name
		winston.debug "install.checkConfig: invalid name, returning error"
		return new Error "Invalid package name!"
	winston.silly "install.checkConfig: valid name"

	if not semver.valid config.version
		winston.debug "install.checkConfig: invalid version, returning error"
		return new Error "Invalid package version!"
	winston.silly "install.checkConfig: valid version"

	if not config.mc or not semver.validRange config.mc
		winston.debug "install.checkConfig: invalid mc, returning error"
		return new Error "Invalid package mc!"
	winston.silly "install.checkConfig: valid mc"

	if not config.install_file_list and not config.install_executable
		winston.debug "install.checkConfig: no install_file_list and " +
			"install_executable, returning error"
		return new Error "No install_file_list and install_executable!"
	winston.silly "install.checkConfig: install_file_list or " +
		"install_executable is there"

	if config.install_file_list and
	( typeof config.install_file_list isnt "object" ) or
	Array.isArray config.install_file_list
		winston.debug "install.checkConfig: install_file_list is not an " +
			"array, returning error"
		return new Error "Specified install_file_list is not an object!"
	winston.silly "install.checkConfig: valid install_file_list"

	winston.verbose "install.checkConfig: all ok, returning config"
	config

module.exports = checkConfig
