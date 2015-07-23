var fs, path, readConfig, winston;

fs = require("fs-extra");

path = require("path");

winston = require("winston");

readConfig = function(packageDirectory) {
  var configFilename, result;
  winston.verbose("install.readConfig: starting");
  try {
    winston.silly("install.readConfig: trying to read config");
    configFilename = path.join(packageDirectory, "mcpm-package.json");
    result = fs.readFileSync(configFilename, {
      encoding: "utf-8"
    });
    winston.verbose("install.readConfig: success, returning result");
    return result;
  } catch (_error) {
    winston.debug("install.readConfig: error, returning null");
    return null;
  }
};

module.exports = readConfig;
