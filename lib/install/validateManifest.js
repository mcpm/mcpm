var minecraftUtils, readManifest, semver, validateManifest, winston;

semver = require("semver");

winston = require("winston");

readManifest = require("./readManifest");

minecraftUtils = require("../minecraftUtils");

validateManifest = function(packageDirectory) {
  var config;
  winston.verbose("install.validateManifest: starting");
  try {
    winston.silly("install.validateManifest: parsing config");
    config = JSON.parse(readManifest(packageDirectory));
  } catch (_error) {}
  winston.silly("install.validateManifest: finished parsing");
  if (!config) {
    winston.debug("install.validateManifest: no config, returning error");
    return new SyntaxError("Invalid JSON in package config!");
  }
  winston.silly("install.validateManifest: JSON was valid");
  if (!config.name || !/^[a-z]([\w-]*[a-z])?$/i.test(config.name)) {
    winston.debug("install.validateManifest: invalid name, returning error");
    return new Error("Invalid package name!");
  }
  winston.silly("install.validateManifest: valid name");
  if (!semver.valid(config.version)) {
    winston.debug("install.validateManifest: invalid version, returning error");
    return new Error("Invalid package version!");
  }
  winston.silly("install.validateManifest: valid version");
  if (!config.mc || !semver.validRange(config.mc)) {
    winston.debug("install.validateManifest: invalid mc, returning error");
    return new Error("Invalid package mc!");
  }
  winston.silly("install.validateManifest: valid mc");
  if (!semver.satisfies(minecraftUtils.getCurrentProfile().version, config.mc)) {
    winston.debug("install.validateManifest: incompatible mc, returning error");
    return new Error("The package is incompatible with the current " + "Minecraft version!");
  }
  winston.silly("install.validateManifest: compatible mc");
  if (!config.install_file_list && !config.install_executable) {
    winston.debug("install.validateManifest: no install_file_list and " + "install_executable, returning error");
    return new Error("No install_file_list and install_executable!");
  }
  winston.silly("install.validateManifest: install_file_list or " + "install_executable is there");
  if (config.install_file_list && (typeof config.install_file_list !== "object") || Array.isArray(config.install_file_list)) {
    winston.debug("install.validateManifest: install_file_list is not an " + "array, returning error");
    return new Error("Specified install_file_list is not an object!");
  }
  winston.silly("install.validateManifest: valid install_file_list");
  winston.verbose("install.validateManifest: all ok, returning config");
  return config;
};

module.exports = validateManifest;
