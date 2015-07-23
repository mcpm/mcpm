var childProcess, fs, glob, minecraftUtils, path, semver, winston;

fs = require("fs-extra");

path = require("path");

semver = require("semver");

glob = require("glob");

childProcess = require("child_process");

minecraftUtils = require("./minecraftUtils");

winston = require("winston");

module.exports = {
  parsePackageString: function(str) {
    winston.verbose("install.parsePackageString: starting");
    if (typeof str !== "string") {
      winston.debug("install.parsePackageString: str is not a " + "string, returning null");
      return null;
    }
    if (str.startsWith("folder:")) {
      winston.verbose("install.parsePackageString: str starts with " + "'folder', parsing as a folder");
      str = str.substring("folder:".length);
    }
    if (str.includes(":")) {
      winston.debug("install.parsePackageString: str includes a " + "colon, returning null");
      return null;
    } else {
      winston.verbose("install.parsePackageString: str is a folder, " + "returning it with type 'folder'");
      return {
        type: "folder",
        name: str
      };
    }
  },
  readConfig: function(packageDirectory) {
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
  },
  checkConfig: function(packageDirectory) {
    var config;
    winston.verbose("install.checkConfig: starting");
    try {
      winston.silly("install.checkConfig: parsing config");
      config = JSON.parse(this.readConfig(packageDirectory));
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
    if (!config.install_file_list && !config.install_executable) {
      winston.debug("install.checkConfig: no install_file_list and " + "install_executable, returning error");
      return new Error("No install_file_list and install_executable!");
    }
    winston.silly("install.checkConfig: install_file_list or " + "install_executable is there");
    if (config.install_file_list && !Array.isArray(config.install_file_list)) {
      winston.debug("install.checkConfig: install_file_list is not an " + "array, returning error");
      return new Error("Specified install_file_list is not an array!");
    }
    winston.silly("install.checkConfig: valid install_file_list");
    winston.verbose("install.checkConfig: all ok, returning config");
    return config;
  },
  flattenFileList: function(list, packageDirectory) {
    var expandedGlob, filePath, flattened, fromGlob, i, len, normalizedFilePath, normalizedToWhere, toWhere;
    winston.verbose("install.flattenFileList: starting");
    if (!packageDirectory) {
      winston.debug("install.flattenFileList: packageDirectory not" + "specified, returning error");
      return new Error("Package directory not specified!");
    }
    winston.silly("install.flattenFileList: packageDirectory specified");
    flattened = {};
    for (toWhere in list) {
      fromGlob = list[toWhere];
      winston.verbose("install.flattenFileList: next glob", {
        toWhere: toWhere,
        fromGlob: fromGlob
      });
      normalizedToWhere = path.posix.normalize(toWhere);
      winston.silly("install.flattenFileList: normalizedToWhere: " + normalizedToWhere);
      if ((normalizedToWhere.startsWith(".." + path.sep)) || (normalizedToWhere === "..")) {
        winston.debug("install.flattenFileList: trying to copy to " + "outside of Minecraft, returning error");
        return new Error("Trying to copy to outside of Minecraft!");
      }
      if (path.isAbsolute(normalizedToWhere)) {
        winston.debug("install.flattenFileList: trying to copy to " + "an absolute path, returning error");
        return new Error("Trying to copy to an absolute path!");
      }
      expandedGlob = glob.sync(fromGlob, {
        cwd: packageDirectory
      });
      winston.silly("install.flattenFileList: expanded glob", expandedGlob);
      for (i = 0, len = expandedGlob.length; i < len; i++) {
        filePath = expandedGlob[i];
        winston.silly("install.flattenFileList: next path", filePath);
        normalizedFilePath = path.posix.normalize(filePath);
        winston.silly("install.flattenFileList: normalized: " + normalizedFilePath);
        if ((normalizedFilePath.startsWith(".." + path.sep)) || (normalizedFilePath === "..")) {
          winston.debug("install.flattenFileList: trying to copy " + "from outside of the package, returning error");
          return new Error("Trying to copy from outside of the package!");
        }
        if (path.isAbsolute(normalizedFilePath)) {
          winston.debug("install.flattenFileList: trying to copy " + "from an absolute path, returning error");
          return new Error("Trying to copy from an absolute path!");
        }
        if (flattened[normalizedToWhere] == null) {
          flattened[normalizedToWhere] = [];
        }
        flattened[normalizedToWhere].push(normalizedFilePath);
        winston.verbose("install.flattenFileList: added to the list: " + normalizedFilePath);
      }
    }
    winston.silly("install.flattenFileList: flattened", flattened);
    return flattened;
  },
  copyFiles: function(list, packageDirectory) {
    var absoluteFrom, absoluteTo, from, fromList, i, len, minecraftRoot, to;
    winston.verbose("install.copyFiles: starting");
    minecraftRoot = minecraftUtils.getMinecraftPath();
    winston.silly("install.copyFiles: got path to Minecraft root: " + minecraftRoot);
    for (to in list) {
      fromList = list[to];
      winston.verbose("install.copyFiles: next to: " + to);
      for (i = 0, len = fromList.length; i < len; i++) {
        from = fromList[i];
        winston.silly("install.copyFiles: next from: " + from);
        absoluteFrom = path.join(packageDirectory, from);
        winston.silly("install.copyFiles: absoluteFrom: " + absoluteFrom);
        absoluteTo = path.join(minecraftRoot, to, path.basename(from));
        winston.verbose("install.copyFiles: absoluteTo: " + absoluteTo);
        fs.copySync(absoluteFrom, absoluteTo);
        winston.silly("install.copyFiles: copied");
      }
    }
    winston.verbose("install.copyFiles: finished copying");
    return true;
  },
  invokeInstallExecutable: function(file, packageDirectory) {
    var err, fullPath, normalizedFilePath;
    winston.verbose("install.invokeInstallExecutable: starting");
    normalizedFilePath = path.normalize(file);
    winston.silly("install.invokeInstallExecutable: normalizedFilePath:" + normalizedFilePath);
    if ((normalizedFilePath.startsWith(".." + path.sep)) || (normalizedFilePath === "..")) {
      winston.debug("install.invokeInstallExecutable: trying to call a " + "file outside of the package, returning error");
      return new Error("Trying to call a file outside of the package!");
    }
    fullPath = path.normalize(path.join(packageDirectory, file));
    winston.verbose("install.invokeInstallExecutable: fullPath: " + fullPath);
    try {
      winston.silly("install.invokeInstallExecutable: trying to exec");
      childProcess.execFileSync(fullPath, [], {
        cwd: packageDirectory,
        env: {
          MCPM: "1",
          PATH_TO_MINECRAFT: minecraftUtils.getMinecraftPath()
        }
      });
    } catch (_error) {
      err = _error;
      winston.debug("install.invokeInstallExecutable: failed, " + "returning error");
      return err;
    }
    winston.verbose("install.invokeInstallExecutable: success, returning " + "true");
    return true;
  },
  fromFolder: function(packageDirectory) {
    var config, list, result;
    winston.verbose("install.fromFolder: starting");
    config = this.checkConfig(packageDirectory);
    winston.silly("install.fromFolder: checked config", config);
    if (config instanceof Error) {
      winston.debug("install.fromFolder: invalid config, returning error");
      return config;
    }
    winston.info(config.name + "@" + config.version + ": Installing...");
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
      winston.info(config.name + "@" + config.version + ": Copying files...");
      result = this.copyFiles(list, packageDirectory);
      winston.silly("install.fromFolder: copied files", result);
      if (result instanceof Error) {
        winston.debug("install.fromFolder: error while copying, " + "returning error");
        return result;
      }
    }
    if (config.install_executable) {
      winston.silly("install.fromFolder: found install_executable");
      winston.info((config.name + "@" + config.version + ": Calling ") + "provided installation executable...");
      winston.debug("install.fromFolder: invoking install executable");
      result = this.invokeInstallExecutable(config.install_executable, packageDirectory);
      winston.silly("install.fromFolder: invoked", result);
      if (result instanceof Error) {
        winston.debug("install.fromFolder: install executable " + "failed, returning error");
        return result;
      }
    }
    winston.verbose("install.fromFolder: adding installed package");
    result = minecraftUtils.addInstalledPackage(config.name, config.version);
    winston.verbose("install.fromFolder: done, returning result");
    return result;
  }
};
