var parsePackageString, winston;

winston = require("winston");

parsePackageString = function(str) {
  var detectedType, ref;
  winston.verbose("install.parsePackageString: starting");
  if (typeof str !== "string") {
    winston.debug("install.parsePackageString: str is not a string, returning null");
    return null;
  }
  if (str.startsWith("zip:")) {
    winston.verbose("install.parsePackageString: str starts with 'zip', parsing as a zip");
    str = str.substring("zip:".length);
    detectedType = "zip";
  } else if (str.endsWith(".zip")) {
    winston.verbose("install.parsePackageString: str ends with '.zip', parsing as a zip");
    detectedType = "zip";
  } else if (str.startsWith("folder:")) {
    winston.verbose("install.parsePackageString: str starts with 'folder', parsing as a folder");
    str = str.substring("folder:".length);
    detectedType = "folder";
  }
  if (((ref = str.match(/:/g)) != null ? ref.length : void 0) > 1) {
    winston.debug("install.parsePackageString: too many colons, returning null");
    return null;
  }
  if (!detectedType) {
    winston.verbose("install.parsePackageString: using type 'folder' by default");
    detectedType = "folder";
  }
  return {
    type: detectedType,
    name: str
  };
};

module.exports = parsePackageString;
