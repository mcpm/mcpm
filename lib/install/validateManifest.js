let semver = require('semver')
let readManifest = require('./readManifest')
let getCurrentProfile = require('../util/getCurrentProfile')
let _ = require('lodash')

function validateManifest (packageDirectory) {
  let manifest

  try {
    manifest = JSON.parse(readManifest(packageDirectory))
  } catch (err) {
    return new SyntaxError('Invalid JSON in package manifest!')
  }

  if (!manifest.name || !/^[a-z]([\w-]*[a-z])?$/i.test(manifest.name)) {
    return new Error('Invalid package name!')
  }

  if (!semver.valid(manifest.version)) {
    return new Error('Invalid package version!')
  }

  if (!manifest.mc || !semver.validRange(manifest.mc)) {
    return new Error('Invalid package mc!')
  }

  let actualVersion = getCurrentProfile().version
  let compatibleRange = manifest.mc
  if (!semver.satisfies(actualVersion, compatibleRange)) {
    return new Error(`The package is incompatible with the current Minecraft version! Compatible version range: ${compatibleRange}`
    )
  }

  if (!manifest.install_file_list && !manifest.install_executable) {
    return new Error('No install_file_list and install_executable!')
  }

  if (manifest.install_file_list && !_.isPlainObject(manifest.install_file_list)) {
    return new Error('Specified install_file_list is not an object!')
  }

  return manifest
}

module.exports = validateManifest
