var AdmZip, cache, fromZip, fs, installFromFolder, tmp, winston;

winston = require("winston");

fs = require("fs");

tmp = require("tmp");

AdmZip = require("adm-zip");

installFromFolder = require("./fromFolder");

cache = require("../cache");

fromZip = function(pathToArchive) {
  var config, e, stats, tempFolderPath, unzipResult, zip;
  winston.info(pathToArchive + ": Installing from a zip...");
  winston.verbose("install.fromZip: starting");
  stats = fs.statSync(pathToArchive);
  if (!stats.isFile()) {
    winston.debug("install.fromZip: path doesn't point to a file, returning error");
    return new Error("Provided path doesn't point to a file!");
  }
  try {
    zip = new AdmZip(pathToArchive);
  } catch (_error) {
    e = _error;
    winston.debug("install.fromZip: can't read zip, returning error");
    return new Error(e);
  }
  if (!zip.getEntry("mcpm-package.json")) {
    winston.debug("install.fromZip: no manifest inside, returning error");
    return new Error("The archive doesn't have mcpm-package.json inside!");
  }
  tempFolderPath = tmp.dirSync({
    prefix: "mcpm-"
  }).name;
  winston.verbose("install.fromZip: temp dir: " + tempFolderPath);
  try {
    unzipResult = zip.extractAllTo(tempFolderPath);
  } catch (_error) {
    e = _error;
    unzipResult = new Error(e);
  }
  if (unzipResult instanceof Error) {
    winston.debug("install.fromZip: can't unzip, returning error", unzipResult);
    return new Error("Can't unzip the archive to a temp directory!");
  }
  winston.silly("install.fromZip: unziped, calling fromFolder");
  config = installFromFolder(tempFolderPath, pathToArchive);
  if (config instanceof Error) {
    winston.debug("install.fromZip: error during installation, returning error", unzipResult);
    return config;
  }
  cache.add(pathToArchive, config);
  winston.info(config.name + "@" + config.version + ": Added to cache");
  return config;
};

module.exports = fromZip;
