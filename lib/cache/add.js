var add, fs, path, util, winston;

winston = require("winston");

path = require("path");

fs = require("fs-extra");

util = require("../util");

add = function(pathToZip, manifest) {
  var pathToPackageCache;
  winston.verbose("cache.add: starting");
  pathToPackageCache = path.join(util.getPathToMcpmDir(), "cache", manifest.name, manifest.version);
  winston.silly("cache.add: pathToPackageCache:", pathToPackageCache);
  fs.outputJsonSync(manifest, path.join(pathToPackageCache, "mcpm-package.json"));
  winston.silly("cache.add: cached manifest");
  fs.copySync(pathToZip, path.join(pathToPackageCache, "mcpm-package.zip"));
  winston.silly("cache.add: cached zip");
  winston.verbose("cache.add: success");
};

module.exports = add;
