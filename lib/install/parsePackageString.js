var parsePackageString, winston;

winston = require("winston");

parsePackageString = function(str) {
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
};

module.exports = parsePackageString;
