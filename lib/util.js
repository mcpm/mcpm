var fs, os, path, winston;

os = require("os");

path = require("path");

fs = require("fs");

winston = require("winston");

module.exports = {
  getMinecraftPath: function() {
    var homeDir, relativeMinecraftPath, result;
    winston.verbose("util.getMinecraftPath: starting");
    homeDir = process.env.HOME;
    winston.silly("util.getMinecraftPath: HOME: " + homeDir);
    winston.silly("util.getMinecraftPath: os platform: " + os.platform());
    relativeMinecraftPath = (function() {
      switch (os.platform()) {
        case "win32":
          return "AppData/Roaming/.minecraft";
        case "linux":
          return ".minecraft";
        case "darwin":
          return "Library/Application Support/minecraft";
      }
    })();
    winston.silly("util.getMinecraftPath: " + ("relativeMinecraftPath: " + relativeMinecraftPath));
    result = path.join(homeDir, relativeMinecraftPath);
    winston.verbose("util.getMinecraftPath: result: " + result);
    return result;
  },
  getCurrentProfile: function() {
    var currentProfile, currentProfileName, launcherProfiles, pathToProfiles, ref, result, version;
    winston.verbose("util.getCurrentProfile: starting");
    pathToProfiles = path.join(this.getMinecraftPath(), "launcher_profiles.json");
    winston.silly("util.getCurrentProfile: " + pathToProfiles);
    launcherProfiles = JSON.parse(fs.readFileSync(pathToProfiles, {
      encoding: "utf-8"
    }));
    winston.silly("util.getCurrentProfile: parsed profiles");
    currentProfileName = launcherProfiles.selectedProfile;
    currentProfile = launcherProfiles.profiles[currentProfileName];
    winston.silly("util.getCurrentProfile: current profile: ", currentProfile);
    version = currentProfile.lastVersionId.split("-")[0];
    winston.silly("util.getCurrentProfile: raw version: " + version);
    if (/^\d+\.\d+$/.test(version)) {
      winston.silly("util.getCurrentProfile: adding " + "'.0' to the version");
      version += ".0";
    }
    result = {
      originalInfo: currentProfile,
      installedPackages: (ref = currentProfile.mcpmInstalledPackages) != null ? ref : [],
      version: version
    };
    winston.verbose("util.getCurrentProfile: success", result);
    return result;
  },
  setCurrentProfile: function(newProfile) {
    var currentProfileName, launcherProfiles, pathToProfiles;
    winston.verbose("util.setCurrentProfile: starting");
    winston.silly("util.getCurrentProfile: new profile: ", newProfile);
    pathToProfiles = path.join(this.getMinecraftPath(), "launcher_profiles.json");
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
  },
  addInstalledPackage: function(name, version) {
    var currentProfile;
    winston.verbose("util.addInstalledPackage: starting");
    currentProfile = this.getCurrentProfile().originalInfo;
    winston.silly("util.addInstalledPackage: old profile", currentProfile);
    if (currentProfile.mcpmInstalledPackages == null) {
      currentProfile.mcpmInstalledPackages = {};
    }
    currentProfile.mcpmInstalledPackages[name] = version;
    winston.silly("util.addInstalledPackage: new profile", currentProfile);
    winston.silly("util.addInstalledPackage: writing back to file");
    this.setCurrentProfile(currentProfile);
    winston.verbose("util.addInstalledPackage: success, " + "returning nothing");
  }
};
