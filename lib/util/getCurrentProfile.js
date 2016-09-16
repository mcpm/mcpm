let os = require('os')
let path = require('path')
let fs = require('fs')
let winston = require('winston')

let getMinecraftPath = require('./getMinecraftPath')

let getCurrentProfile = function (callback) {
  winston.verbose('util.getCurrentProfile: starting')
  let pathToProfiles = path.join(getMinecraftPath(), 'launcher_profiles.json')
  winston.silly(`util.getCurrentProfile: ${pathToProfiles}`)
  return fs.readFile(pathToProfiles, { encoding: 'utf-8' }, function (err, rawContent) {
    let launcherProfiles = JSON.parse(rawContent)
    winston.silly('util.getCurrentProfile: parsed profiles')

    let currentProfileName = launcherProfiles.selectedProfile
    let currentProfile = launcherProfiles.profiles[ currentProfileName ]
    winston.silly('util.getCurrentProfile: current profile: ',
      currentProfile)

    let version = currentProfile.lastVersionId.split('-')[ 0 ]
    winston.silly(`util.getCurrentProfile: raw version: ${version}`)

    if (/^\d+\.\d+$/.test(version)) {
      winston.silly('util.getCurrentProfile: adding ' +
        "'.0' to the version"
      )
      version += '.0'
    }

    let result = {
      originalInfo: currentProfile,
      installedPackages: currentProfile.mcpmInstalledPackages != null ? currentProfile.mcpmInstalledPackages : [],
    version}
    winston.verbose('util.getCurrentProfile: success', result)

    return setTimeout(() => callback(undefined, result))
  }
  )
}

module.exports = getCurrentProfile
