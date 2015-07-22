var fs, path, semver;

fs = require("fs");

path = require("path");

semver = require("semver");

module.exports = {
  parsePackageString: function(str) {
    if (typeof str !== "string") {
      return null;
    }
    if (str.startsWith("folder:")) {
      str = str.substring("folder:".length);
    }
    if (str.includes(":")) {
      return null;
    } else {
      return {
        type: "folder",
        name: str
      };
    }
  },
  readConfig: function(packageDirectory) {
    var configFilename;
    try {
      configFilename = path.join(packageDirectory, "mcpm-package.json");
      return fs.readFileSync(configFilename, {
        encoding: "utf-8"
      });
    } catch (_error) {
      return null;
    }
  },
  checkConfig: function(packageDirectory) {
    var config;
    try {
      config = JSON.parse(this.readConfig(packageDirectory));
    } catch (_error) {}
    if (!config) {
      return new SyntaxError;
    }
    if (!config.name || !/^[a-z]([\w-]*[a-z])?$/i.test(config.name)) {
      return new Error("Invalid package name!");
    }
    if (!semver.valid(config.version)) {
      return new Error("Invalid package version!");
    }
    if (!config.mc || !semver.validRange(config.mc)) {
      return new Error("Invalid package mc!");
    }
    if (!config.install_file_list && !config.install_executable) {
      return new Error("No install_file_list and install_executable!");
    }
    if (config.install_file_list && !Array.isArray(config.install_file_list)) {
      return new Error("Specified install_file_list is not an array!");
    }
    return true;
  }
};
