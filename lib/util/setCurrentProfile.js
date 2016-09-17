let path = require('path')
let fs = require('fs')
let winston = require('winston')

let getMinecraftPath = require('./getMinecraftPath')

let setCurrentProfile = function (newProfile, callback) {
  winston.verbose('util.setCurrentProfile: starting')
  winston.silly('util.setCurrentProfile: new profile: ', newProfile)

  let pathToProfiles = path.join(getMinecraftPath(), 'launcher_profiles.json')
  winston.silly(`util.setCurrentProfile: ${pathToProfiles}`)

  let launcherProfiles = JSON.parse(fs.readFileSync(pathToProfiles, {encoding: 'utf-8'}))
  winston.silly('util.setCurrentProfile: parsed profiles')

  let currentProfileName = launcherProfiles.selectedProfile

  launcherProfiles.profiles[ currentProfileName ] = newProfile

  winston.silly('util.setCurrentProfile: writing back to file')
  let serializedProfiles = JSON.stringify(launcherProfiles, null, 2)
  return fs.writeFile(pathToProfiles, serializedProfiles, function (err) {
    winston.verbose('util.setCurrentProfile: result:', err)
    return callback(err)
  }
  )
}

module.exports = setCurrentProfile
