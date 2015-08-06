var getUserSettingsDir, path;

path = require("path");

getUserSettingsDir = require("user-settings-dir");

module.exports = function() {
  return path.join(getUserSettingsDir(), ".mcpm");
};
