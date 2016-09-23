let semver = require('semver')
let getClientVersion = require('./util/getClientVersion')
let _ = require('lodash')

module.exports = function validateManifest (manifest) {
  return getClientVersion()
  .then(clientVersion => {
    if (!manifest.name || !/^[a-z]([\w-]*[a-z])?$/i.test(manifest.name)) {
      throw new Error('Invalid package name!')
    }

    if (!semver.valid(manifest.version)) {
      throw new Error('Invalid package version!')
    }

    if (!manifest.mc || !semver.validRange(manifest.mc)) {
      throw new Error('Invalid package mc!')
    }

    let compatibleRange = manifest.mc
    if (!semver.satisfies(clientVersion, compatibleRange)) {
      throw new Error('The package is incompatible with the current Minecraft version! ' +
        `Compatible version range: ${compatibleRange}`)
    }

    if (!manifest.install_file_list && !manifest.install_executable) {
      throw new Error('No install_file_list and install_executable!')
    }

    if (manifest.install_file_list && !_.isPlainObject(manifest.install_file_list)) {
      throw new Error('Specified install_file_list is not an object!')
    }

    return true
  })
}
