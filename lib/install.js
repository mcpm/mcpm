function install (packageString) {
  let parsed = install.parsePackageString(packageString)

  switch ((parsed || {}).type) {
    case 'folder': return install.fromFolder(parsed.name)
    case 'zip': return install.fromZip(parsed.name)
    case 'cache': return install.fromCache(parsed.name, parsed.version)
    default: return new Error('Invalid package string!')
  }
}

install.parsePackageString = require('./install/parsePackageString')
install.readManifest = require('./install/readManifest')
install.validateManifest = require('./install/validateManifest')
install.flattenFileList = require('./install/flattenFileList')
install.copyFiles = require('./install/copyFiles')
install.invokeInstallExecutable = require('./install/invokeInstallExecutable')
install.fromCache = require('./install/fromCache')
install.fromFolder = require('./install/fromFolder')
install.fromZip = require('./install/fromZip')

module.exports = install
