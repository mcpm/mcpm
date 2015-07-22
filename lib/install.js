var childProcess, fs, glob, minecraftUtils, path, semver;

fs = require("fs-extra");

path = require("path");

semver = require("semver");

glob = require("glob");

childProcess = require("child_process");

minecraftUtils = require("./minecraftUtils");

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
      return new SyntaxError("Invalid JSON in package config!");
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
  },
  flattenFileList: function(list, packageDirectory) {
    var expandedGlob, filePath, flattened, fromGlob, i, len, normalizedFilePath, normalizedToWhere, toWhere;
    if (!packageDirectory) {
      return new Error("Package directory not specified!");
    }
    flattened = {};
    for (toWhere in list) {
      fromGlob = list[toWhere];
      normalizedToWhere = path.posix.normalize(toWhere);
      if ((normalizedToWhere.startsWith(".." + path.sep)) || (normalizedToWhere === "..")) {
        return new Error("Trying to copy to outside of Minecraft!");
      }
      if (path.isAbsolute(normalizedToWhere)) {
        return new Error("Trying to copy to an absolute path!");
      }
      expandedGlob = glob.sync(fromGlob, {
        cwd: packageDirectory
      });
      for (i = 0, len = expandedGlob.length; i < len; i++) {
        filePath = expandedGlob[i];
        normalizedFilePath = path.posix.normalize(filePath);
        if ((normalizedFilePath.startsWith(".." + path.sep)) || (normalizedFilePath === "..")) {
          return new Error("Trying to copy from outside of the package!");
        }
        if (path.isAbsolute(normalizedFilePath)) {
          return new Error("Trying to copy from an absolute path!");
        }
        if (flattened[normalizedToWhere] == null) {
          flattened[normalizedToWhere] = [];
        }
        flattened[normalizedToWhere].push(normalizedFilePath);
      }
    }
    return flattened;
  },
  copyFiles: function(list, packageDirectory) {
    var absoluteFrom, absoluteTo, from, fromList, i, len, minecraftRoot, to;
    minecraftRoot = minecraftUtils.getMinecraftPath();
    for (to in list) {
      fromList = list[to];
      for (i = 0, len = fromList.length; i < len; i++) {
        from = fromList[i];
        absoluteFrom = path.join(packageDirectory, from);
        absoluteTo = path.join(minecraftRoot, to, path.basename(from));
        fs.copySync(absoluteFrom, absoluteTo);
      }
    }
    return true;
  },
  invokeInstallExecutable: function(file, packageDirectory) {
    var fullPath, normalizedFilePath;
    normalizedFilePath = path.normalize(file);
    if ((normalizedFilePath.startsWith(".." + path.sep)) || (normalizedFilePath === "..")) {
      return new Error("Trying to call a file outside of the package!");
    }
    fullPath = path.normalize(path.join(packageDirectory, file));
    return childProcess.execFileSync(fullPath, [], {
      cwd: packageDirectory,
      env: {
        MCPM: "1",
        PATH_TO_MINECRAFT: minecraftUtils.getMinecraftPath()
      }
    });
  }
};
