let path = require('path')
let getUserSettingsDir = require('user-settings-dir')

module.exports = function () {
  return path.join(getUserSettingsDir(), '.mcpm')
}
