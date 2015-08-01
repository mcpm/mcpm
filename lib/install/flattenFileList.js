var flattenFileList, flattenGlobList, glob, globToFileList, path, winston;

path = require("path");

glob = require("glob");

winston = require("winston");

flattenGlobList = function(globList) {
  var flattenedGlobList, fromGlob, i, individualGlob, len, toWhere;
  winston.silly("install.flattenFileList: flattening glob list");
  flattenedGlobList = [];
  for (toWhere in globList) {
    fromGlob = globList[toWhere];
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
  return flattenedGlobList;
};

globToFileList = function(fromGlob, unpackedPath, zipPath) {
  var expandedGlob, fileList, filePath, i, len, normalizedFilePath;
  fileList = [];
  if (fromGlob === "@") {
    if (zipPath) {
      winston.verbose("install.flattenFileList: adding @ to list:", zipPath);
      fileList.push(zipPath);
    } else {
      winston.verbose("install.flattenFileList: ignoring @, no zipPath");
    }
    return fileList;
  }
  expandedGlob = glob.sync(fromGlob, {
    cwd: unpackedPath
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
    fileList.push(normalizedFilePath);
    winston.verbose("install.flattenFileList: added to the list: " + normalizedFilePath);
  }
  return fileList;
};

flattenFileList = function(list, unpackedPath, zipPath) {
  var fileList, flattened, flattenedGlobList, fromGlob, i, len, normalizedToWhere, ref, toWhere;
  winston.verbose("install.flattenFileList: starting");
  if (!unpackedPath) {
    winston.debug("install.flattenFileList: unpackedPath not specified, returning error");
    return new Error("Package directory not specified!");
  }
  winston.silly("install.flattenFileList: unpackedPath specified");
  flattenedGlobList = flattenGlobList(list);
  flattened = {};
  for (i = 0, len = flattenedGlobList.length; i < len; i++) {
    ref = flattenedGlobList[i], toWhere = ref[0], fromGlob = ref[1];
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
    fileList = globToFileList(fromGlob, unpackedPath, zipPath);
    if (fileList instanceof Error) {
      return fileList;
    }
    if (flattened[normalizedToWhere] == null) {
      flattened[normalizedToWhere] = [];
    }
    flattened[normalizedToWhere] = flattened[normalizedToWhere].concat(fileList);
  }
  winston.silly("install.flattenFileList: flattened", flattened);
  return flattened;
};

module.exports = flattenFileList;
