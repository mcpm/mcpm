let path = require('path')
let fs = require('fs')
let getMinecraftPath = require('./getMinecraftPath')

function setCurrentProfile (newProfile, callback) {
  let pathToProfiles = path.join(getMinecraftPath(), 'launcher_profiles.json')
  let profiles = JSON.parse(fs.readFileSync(pathToProfiles, {encoding: 'utf-8'}))
  let currentProfileName = profiles.selectedProfile
  profiles.profiles[currentProfileName] = newProfile

  let serializedProfiles = JSON.stringify(profiles, null, 2)
  fs.writeFile(pathToProfiles, serializedProfiles, callback)
}

module.exports = setCurrentProfile
