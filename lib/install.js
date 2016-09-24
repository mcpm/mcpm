let parsePackageString = require('./install/parsePackageString')
let ensureUnzipped = require('./ensureUnzipped')
let readManifest = require('./install/readManifest')
let validateManifest = require('./validateManifest')
let handleInstallFileList = require('./handleInstallFileList')
let handleInstallCommand = require('./handleInstallCommand')
let addInstalledPackage = require('./util/addInstalledPackage')

module.exports = function install (packageString) {
  let pkg = parsePackageString(packageString)
  let manifest
  let folderPath
  let zipPath

  return ensureUnzipped(pkg.name)
  .then(unpackedFolder => {
    folderPath = unpackedFolder
    zipPath = (unpackedFolder !== pkg.name) ? pkg.name : null
  })
  .then(() => readManifest(folderPath))
  .then(result => { manifest = result })
  .then(() => validateManifest(manifest))
  .then(() => handleInstallFileList(manifest.install_file_list, folderPath, zipPath))
  .then(() => handleInstallCommand(manifest.install_command, folderPath))
  .then(() => addInstalledPackage(manifest.name, manifest.version))
}
