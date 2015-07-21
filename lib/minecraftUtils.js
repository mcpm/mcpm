var getMinecraftPath;

getMinecraftPath = function() {
  var homeDir, os, path, relativeMinecraftPath;
  os = require("os");
  path = require("path");
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
};

module.exports = {
  getMinecraftPath: getMinecraftPath
};
