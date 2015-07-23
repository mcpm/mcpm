var flattenFileList, glob, path, winston;

path = require("path");

glob = require("glob");

winston = require("winston");

flattenFileList = function(list, packageDirectory) {
  var expandedGlob, filePath, flattened, flattenedGlobList, fromGlob, i, individualGlob, j, k, len, len1, len2, normalizedFilePath, normalizedToWhere, ref, toWhere;
  winston.verbose("install.flattenFileList: starting");
  if (!packageDirectory) {
    winston.debug("install.flattenFileList: packageDirectory not" + "specified, returning error");
    return new Error("Package directory not specified!");
  }
  winston.silly("install.flattenFileList: packageDirectory specified");
  winston.silly("install.flattenFileList: flattening glob list");
  flattenedGlobList = [];
  for (toWhere in list) {
    fromGlob = list[toWhere];
    if (Array.isArray(fromGlob)) {
      winston.silly("install.flattenFileList: flattening glob:", fromGlob);
      for (i = 0, len = fromGlob.length; i < len; i++) {
        individualGlob = fromGlob[i];
        flattenedGlobList.push([toWhere, individualGlob]);
      }
    } else {
      flattenedGlobList.push([toWhere, fromGlob]);
    }
  }
  winston.silly("install.flattenFileList: flattened glob list");
  flattened = {};
  for (j = 0, len1 = flattenedGlobList.length; j < len1; j++) {
    ref = flattenedGlobList[j], toWhere = ref[0], fromGlob = ref[1];
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
    for (k = 0, len2 = expandedGlob.length; k < len2; k++) {
      filePath = expandedGlob[k];
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
};

module.exports = flattenFileList;
