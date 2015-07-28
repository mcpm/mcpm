semver = require "semver"
winston = require "winston"
readManifest = require "./readManifest"
minecraftUtils = require "../minecraftUtils"

validateInstallFields = ( manifest ) ->
	if not manifest.install_file_list and not manifest.install_executable
		winston.debug "install.validateManifest: no install_file_list and " +
			"install_executable, returning error"
		return new Error "No install_file_list and install_executable!"
	winston.silly "install.validateManifest: install_file_list or " +
		"install_executable is there"

	if manifest.install_file_list and
	( typeof manifest.install_file_list isnt "object" ) or
	Array.isArray manifest.install_file_list
		winston.debug "install.validateManifest: install_file_list is not an " +
			"object, returning error"
		return new Error "Specified install_file_list is not an object!"
	winston.silly "install.validateManifest: valid install_file_list"

validateBasicInfo = ( manifest ) ->
	if not manifest
		winston.debug "install.validateManifest: no manifest, returning error"
		return new SyntaxError "Invalid JSON in package manifest!"
	winston.silly "install.validateManifest: JSON was valid"

	if not manifest.name or not /^[a-z]([\w-]*[a-z])?$/i.test manifest.name
		winston.debug "install.validateManifest: invalid name, returning error"
		return new Error "Invalid package name!"
	winston.silly "install.validateManifest: valid name"

	if not semver.valid manifest.version
		winston.debug "install.validateManifest: invalid version, returning error"
		return new Error "Invalid package version!"
	winston.silly "install.validateManifest: valid version"

	if not manifest.mc or not semver.validRange manifest.mc
		winston.debug "install.validateManifest: invalid mc, returning error"
		return new Error "Invalid package mc!"
	winston.silly "install.validateManifest: valid mc"

checkCompatibility = ( manifest ) ->
	if not semver.satisfies minecraftUtils.getCurrentProfile().version, manifest.mc
		winston.debug "install.validateManifest: incompatible mc, returning error"
		return new Error "The package is incompatible with the current " +
			"Minecraft version!"
	winston.silly "install.validateManifest: compatible mc"

validateManifest = ( packageDirectory ) ->
	winston.verbose "install.validateManifest: starting"

	try
		winston.silly "install.validateManifest: parsing manifest"
		manifest = JSON.parse readManifest packageDirectory

	winston.silly "install.validateManifest: finished parsing"

	if invalidBasicInfo = validateBasicInfo manifest
		return invalidBasicInfo
	if compatibilityError = checkCompatibility manifest
		return compatibilityError
	if invalidInstallFields = validateInstallFields manifest
		return invalidInstallFields

	winston.verbose "install.validateManifest: all ok, returning manifest"
	manifest

module.exports = validateManifest
