var install, minecraftUtils;

install = require("./install");

minecraftUtils = require("./minecraftUtils");

module.exports = {
  install: function(packageString) {
    var parsed;
    parsed = install.parsePackageString(packageString);
    if ((parsed != null ? parsed.type : void 0) === "folder") {
      return install.fromFolder(parsed.name);
    } else {
      return new Error("Invalid package string!");
    }
  },
  getMinecraftVersion: function() {
    return minecraftUtils.getCurrentProfile().version;
  }
};
