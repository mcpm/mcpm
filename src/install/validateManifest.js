let semver = require('semver')
let winston = require('winston')
let readManifest = require('./readManifest')
let util = require('../util')

let validateInstallFields = function (manifest) {
  if (!manifest.install_file_list && !manifest.install_executable) {
    winston.debug('install.validateManifest: no install_file_list and ' +
      'install_executable, returning error'
    )
    return new Error('No install_file_list and install_executable!')
  }
  winston.silly('install.validateManifest: install_file_list or ' +
    'install_executable is there'
  )

  if ((manifest.install_file_list &&
    (typeof manifest.install_file_list !== 'object')) ||
    Array.isArray(manifest.install_file_list)) {
    winston.debug('install.validateManifest: install_file_list is not an ' +
      'object, returning error'
    )
    return new Error('Specified install_file_list is not an object!')
  }
  return winston.silly('install.validateManifest: valid install_file_list')
}

let validateBasicInfo = function (manifest) {
  if (!manifest) {
    winston.debug('install.validateManifest: no manifest, returning error')
    return new SyntaxError('Invalid JSON in package manifest!')
  }
  winston.silly('install.validateManifest: JSON was valid')

  if (!manifest.name || !/^[a-z]([\w-]*[a-z])?$/i.test(manifest.name)) {
    winston.debug('install.validateManifest: invalid name, returning error')
    return new Error('Invalid package name!')
  }
  winston.silly('install.validateManifest: valid name')

  if (!semver.valid(manifest.version)) {
    winston.debug('install.validateManifest: invalid version, returning error')
    return new Error('Invalid package version!')
  }
  winston.silly('install.validateManifest: valid version')

  if (!manifest.mc || !semver.validRange(manifest.mc)) {
    winston.debug('install.validateManifest: invalid mc, returning error')
    return new Error('Invalid package mc!')
  }
  return winston.silly('install.validateManifest: valid mc')
}

let checkCompatibility = function (manifest) {
  let actualVersion = util.getCurrentProfile().version
  let compatibleRange = manifest.mc
  if (!semver.satisfies(actualVersion, compatibleRange)) {
    winston.debug('install.validateManifest: incompatible mc, returning error',
      { actualVersion, compatibleRange})
    return new Error('The package is incompatible with the current ' +
      `Minecraft version! Compatible version range: ${compatibleRange}`
    )
  }
  return winston.silly('install.validateManifest: compatible mc', { actualVersion, compatibleRange})
}

let validateManifest = function (packageDirectory) {
  let invalidBasicInfo
  let compatibilityError
  let invalidInstallFields
  winston.verbose('install.validateManifest: starting')

  try {
    winston.silly('install.validateManifest: parsing manifest')
    var manifest = JSON.parse(readManifest(packageDirectory))
  } catch (error) {}

  winston.silly('install.validateManifest: finished parsing')

  if (invalidBasicInfo = validateBasicInfo(manifest)) {
    return invalidBasicInfo
  }
  if (compatibilityError = checkCompatibility(manifest)) {
    return compatibilityError
  }
  if (invalidInstallFields = validateInstallFields(manifest)) {
    return invalidInstallFields
  }

  winston.verbose('install.validateManifest: all ok, returning manifest')
  return manifest
}

module.exports = validateManifest
