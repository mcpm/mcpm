var getMinecraftPath, os, path, winston;

os = require("os");

path = require("path");

winston = require("winston");

getMinecraftPath = function() {
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
};

module.exports = getMinecraftPath;
