var getClientVersion, getCurrentProfile, winston;

winston = require("winston");

getCurrentProfile = require("./getCurrentProfile");

getClientVersion = function() {
  var version;
  winston.verbose("util.getClientVersion: starting");
  version = getCurrentProfile().version;
  winston.verbose("util.getClientVersion: success:", version);
  winston.silly("util.getClientVersion: returning version");
  return version;
};

module.exports = getClientVersion;
