var checkConfig, minecraftUtils, readConfig, semver, winston;

semver = require("semver");

winston = require("winston");

readConfig = require("./readConfig");

minecraftUtils = require("../minecraftUtils");

checkConfig = function(packageDirectory) {
  var config;
  winston.verbose("install.checkConfig: starting");
  try {
    winston.silly("install.checkConfig: parsing config");
    config = JSON.parse(readConfig(packageDirectory));
  } catch (_error) {}
  winston.silly("install.checkConfig: finished parsing");
  if (!config) {
    winston.debug("install.checkConfig: no config, returning error");
    return new SyntaxError("Invalid JSON in package config!");
  }
  winston.silly("install.checkConfig: JSON was valid");
  if (!config.name || !/^[a-z]([\w-]*[a-z])?$/i.test(config.name)) {
    winston.debug("install.checkConfig: invalid name, returning error");
    return new Error("Invalid package name!");
  }
  winston.silly("install.checkConfig: valid name");
  if (!semver.valid(config.version)) {
    winston.debug("install.checkConfig: invalid version, returning error");
    return new Error("Invalid package version!");
  }
  winston.silly("install.checkConfig: valid version");
  if (!config.mc || !semver.validRange(config.mc)) {
    winston.debug("install.checkConfig: invalid mc, returning error");
    return new Error("Invalid package mc!");
  }
  winston.silly("install.checkConfig: valid mc");
  if (!semver.satisfies(minecraftUtils.getCurrentProfile().version, config.mc)) {
    winston.debug("install.checkConfig: incompatible mc, returning error");
    return new Error("The package is incompatible with the current " + "Minecraft version!");
  }
  winston.silly("install.checkConfig: compatible mc");
  if (!config.install_file_list && !config.install_executable) {
    winston.debug("install.checkConfig: no install_file_list and " + "install_executable, returning error");
    return new Error("No install_file_list and install_executable!");
  }
  winston.silly("install.checkConfig: install_file_list or " + "install_executable is there");
  if (config.install_file_list && (typeof config.install_file_list !== "object") || Array.isArray(config.install_file_list)) {
    winston.debug("install.checkConfig: install_file_list is not an " + "array, returning error");
    return new Error("Specified install_file_list is not an object!");
  }
  winston.silly("install.checkConfig: valid install_file_list");
  winston.verbose("install.checkConfig: all ok, returning config");
  return config;
};

module.exports = checkConfig;
