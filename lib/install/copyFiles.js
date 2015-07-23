var copyFiles, fs, minecraftUtils, path, winston;

fs = require("fs-extra");

path = require("path");

minecraftUtils = require("../minecraftUtils");

winston = require("winston");

copyFiles = function(list, packageDirectory, config) {
  var absoluteFrom, absoluteTo, from, fromList, i, len, minecraftRoot, to;
  if (config == null) {
    config = {};
  }
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
      winston.info((config.name + "@" + config.version + ": Copied ") + (from + " to " + to));
    }
  }
  winston.verbose("install.copyFiles: finished copying");
  return true;
};

module.exports = copyFiles;
