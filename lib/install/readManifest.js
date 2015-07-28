var fs, path, readManifest, winston;

fs = require("fs-extra");

path = require("path");

winston = require("winston");

readManifest = function(packageDirectory) {
  var configFilename, result;
  winston.verbose("install.readManifest: starting");
  try {
    winston.silly("install.readManifest: trying to read config");
    configFilename = path.join(packageDirectory, "mcpm-package.json");
    result = fs.readFileSync(configFilename, {
      encoding: "utf-8"
    });
    winston.verbose("install.readManifest: success, returning result");
    return result;
  } catch (_error) {
    winston.debug("install.readManifest: error, returning null");
    return null;
  }
};

module.exports = readManifest;
