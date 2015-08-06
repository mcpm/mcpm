var addInstalledPackage, getCurrentProfile, setCurrentProfile, winston;

winston = require("winston");

getCurrentProfile = require("./getCurrentProfile");

setCurrentProfile = require("./setCurrentProfile");

addInstalledPackage = function(name, version) {
  var currentProfile;
  winston.verbose("util.addInstalledPackage: starting");
  currentProfile = getCurrentProfile().originalInfo;
  winston.silly("util.addInstalledPackage: old profile", currentProfile);
  if (currentProfile.mcpmInstalledPackages == null) {
    currentProfile.mcpmInstalledPackages = {};
  }
  currentProfile.mcpmInstalledPackages[name] = version;
  winston.silly("util.addInstalledPackage: new profile", currentProfile);
  winston.silly("util.addInstalledPackage: writing back to file");
  setCurrentProfile(currentProfile);
  winston.verbose("util.addInstalledPackage: success, " + "returning nothing");
};

module.exports = addInstalledPackage;
