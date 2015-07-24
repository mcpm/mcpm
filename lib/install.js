var childProcess, fs, minecraftUtils, path, winston;

fs = require("fs-extra");

path = require("path");

childProcess = require("child_process");

minecraftUtils = require("./minecraftUtils");

winston = require("winston");

module.exports = {
  parsePackageString: require("./install/parsePackageString"),
  readConfig: require("./install/readConfig"),
  checkConfig: require("./install/checkConfig"),
  flattenFileList: require("./install/flattenFileList"),
  copyFiles: require("./install/copyFiles"),
  invokeInstallExecutable: require("./install/invokeInstallExecutable"),
  fromFolder: function(packageDirectory) {
    var config, list, profile, result;
    winston.verbose("install.fromFolder: starting");
    config = this.checkConfig(packageDirectory);
    winston.silly("install.fromFolder: checked config", config);
    if (config instanceof Error) {
      winston.debug("install.fromFolder: invalid config, returning error");
      return config;
    }
    winston.info((config.name + "@" + config.version + ": Installing from ") + "a folder...");
    if (config.install_file_list) {
      winston.silly("install.fromFolder: found install_file_list");
      winston.verbose("install.fromFolder: flattening list");
      list = this.flattenFileList(config.install_file_list, packageDirectory);
      winston.silly("install.fromFolder: flattened list", list);
      if (list instanceof Error) {
        winston.debug("install.fromFolder: error while flattening, " + "returning error");
        return list;
      }
      winston.debug("install.fromFolder: copying files");
      result = this.copyFiles(list, packageDirectory, config);
      winston.silly("install.fromFolder: copied files", result);
      if (result instanceof Error) {
        winston.debug("install.fromFolder: error while copying, " + "returning error");
        return result;
      }
    }
    if (config.install_executable) {
      winston.silly("install.fromFolder: found install_executable");
      winston.info((config.name + "@" + config.version + ": Calling ") + (config.install_executable + "..."));
      winston.debug("install.fromFolder: invoking install executable");
      result = this.invokeInstallExecutable(config.install_executable, packageDirectory);
      winston.silly("install.fromFolder: invoked", result);
      if (result instanceof Error) {
        winston.debug("install.fromFolder: install executable " + "failed, returning error");
        return result;
      }
    }
    winston.debug("install.fromFolder: adding installed package to profile");
    result = minecraftUtils.addInstalledPackage(config.name, config.version);
    profile = minecraftUtils.getCurrentProfile();
    winston.info(config.name + "@" + config.version + ": Success!");
    winston.verbose("install.fromFolder: done, returning result");
    return result;
  }
};
