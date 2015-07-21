var os, path;

os = require("os");

path = require("path");

module.exports = {
  getMinecraftPath: function() {
    var homeDir, relativeMinecraftPath;
    homeDir = process.env.HOME;
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
    return path.join(homeDir, relativeMinecraftPath);
  },
  getCurrentProfile: function() {
    var currentProfile, currentProfileName, launcherProfiles, version;
    launcherProfiles = require(path.join(this.getMinecraftPath(), "launcher_profiles.json"));
    currentProfileName = launcherProfiles.selectedProfile;
    currentProfile = launcherProfiles.profiles[currentProfileName];
    version = currentProfile.lastVersionId.split("-")[0];
    return {
      originalInfo: currentProfile,
      version: version
    };
  }
};
