var install, winston;

winston = require("winston");

install = function(packageString) {
  var parsed;
  winston.verbose("install: starting");
  parsed = install.parsePackageString(packageString);
  winston.silly("install: parsed string:", parsed);
  if ((parsed != null ? parsed.type : void 0) === "folder") {
    winston.silly("install: installing as folder");
    return install.fromFolder(parsed.name);
  } else if ((parsed != null ? parsed.type : void 0) === "zip") {
    winston.silly("install: installing as zip");
    return install.fromZip(parsed.name);
  } else {
    winston.debug("install: invalid package string, returning error");
    return new Error("Invalid package string!");
  }
};

install.parsePackageString = require("./install/parsePackageString");

install.readManifest = require("./install/readManifest");

install.validateManifest = require("./install/validateManifest");

install.flattenFileList = require("./install/flattenFileList");

install.copyFiles = require("./install/copyFiles");

install.invokeInstallExecutable = require("./install/invokeInstallExecutable");

install.fromFolder = require("./install/fromFolder");

install.fromZip = require("./install/fromZip");

module.exports = install;
