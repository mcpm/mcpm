let path = require('path')
let fs = require('fs')
let getMinecraftPath = require('./getMinecraftPath')

function getCurrentProfile (callback) {
  let pathToProfiles = path.join(getMinecraftPath(), 'launcher_profiles.json')

  return fs.readFile(pathToProfiles, {encoding: 'utf-8'}, (err, rawContent) => {
    if (err) return callback(err, null)

    let launcherProfiles = JSON.parse(rawContent)

    let currentProfileName = launcherProfiles.selectedProfile
    let currentProfile = launcherProfiles.profiles[currentProfileName]

    let version = currentProfile.lastVersionId.split('-')[0]

    if (/^\d+\.\d+$/.test(version)) {
      version += '.0'
    }

    callback(undefined, {
      originalInfo: currentProfile,
      installedPackages: currentProfile.mcpmInstalledPackages || [],
      version
    })
  })
}

module.exports = getCurrentProfile
