module.exports =
	parsePackageString: require "./install/parsePackageString"
	readManifest: require "./install/readManifest"
	validateManifest: require "./install/validateManifest"
	flattenFileList: require "./install/flattenFileList"
	copyFiles: require "./install/copyFiles"
	invokeInstallExecutable: require "./install/invokeInstallExecutable"
	fromFolder: require "./install/fromFolder"
