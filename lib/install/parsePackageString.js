var parsePackageString, winston;

winston = require("winston");

parsePackageString = function(str) {
  var ref;
  winston.verbose("install.parsePackageString: starting");
  if (typeof str !== "string") {
    winston.debug("install.parsePackageString: str is not a " + "string, returning null");
    return null;
  }
  if (str.startsWith("folder:")) {
    winston.verbose("install.parsePackageString: str starts with " + "'folder', parsing as a folder");
    str = str.substring("folder:".length);
  }
  if (((ref = str.match(/:/g)) != null ? ref.length : void 0) > 1) {
    winston.debug("install.parsePackageString: str includes multiple " + "colons, returning null");
    return null;
  } else {
    winston.verbose("install.parsePackageString: str is a folder, " + "returning it with type 'folder'");
    return {
      type: "folder",
      name: str
    };
  }
};

module.exports = parsePackageString;
