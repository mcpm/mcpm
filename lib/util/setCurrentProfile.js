var fs, getMinecraftPath, os, path, setCurrentProfile, winston;

os = require("os");

path = require("path");

fs = require("fs");

winston = require("winston");

getMinecraftPath = require("./getMinecraftPath");

setCurrentProfile = function(newProfile) {
  var currentProfileName, launcherProfiles, pathToProfiles;
  winston.verbose("util.setCurrentProfile: starting");
  winston.silly("util.getCurrentProfile: new profile: ", newProfile);
  pathToProfiles = path.join(getMinecraftPath(), "launcher_profiles.json");
  winston.silly("util.getCurrentProfile: " + pathToProfiles);
  launcherProfiles = JSON.parse(fs.readFileSync(pathToProfiles, {
    encoding: "utf-8"
  }));
  winston.silly("util.getCurrentProfile: parsed profiles");
  currentProfileName = launcherProfiles.selectedProfile;
  launcherProfiles.profiles[currentProfileName] = newProfile;
  winston.silly("util.getCurrentProfile: writing back to file");
  fs.writeFileSync(pathToProfiles, JSON.stringify(launcherProfiles, null, 2));
  winston.verbose("util.getCurrentProfile: success, " + "returning nothing");
};

module.exports = setCurrentProfile;
