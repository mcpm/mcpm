path = require "path"
childProcess = require "child_process"
winston = require "winston"
util = require "../util"

invokeInstallExecutable = ( file, packageDirectory ) ->
	winston.verbose "install.invokeInstallExecutable: starting"
	normalizedFilePath = path.normalize file
	winston.silly "install.invokeInstallExecutable: normalizedFilePath:" +
		normalizedFilePath

	if ( normalizedFilePath.startsWith ".." + path.sep ) or
	( normalizedFilePath is ".." )
		winston.debug "install.invokeInstallExecutable: trying to call a " +
			"file outside of the package, returning error"
		return new Error "Trying to call a file outside of the package!"

	try
		winston.silly "install.invokeInstallExecutable: trying to exec"
		result = childProcess.execFileSync file, [],
			cwd: packageDirectory
			env:
				MCPM: "1"
				PATH_TO_MINECRAFT: util.getMinecraftPath()
	catch err
		winston.debug "install.invokeInstallExecutable: failed, " +
			"returning error"
		return err
	winston.verbose "install.invokeInstallExecutable: exited", result

	winston.verbose "install.invokeInstallExecutable: success, returning " +
		"true"
	true

module.exports = invokeInstallExecutable
