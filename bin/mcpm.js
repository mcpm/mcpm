#!/usr/bin/env node
;
var commander, mcpm, winston;

commander = require("commander");

winston = require("winston");

mcpm = require("../lib/mcpm");

winston.cli();

commander.version(require("../package.json").version);

commander.command("install <packages...>").alias("i").description("install one or more packages").action(function(packages) {
  var i, len, pkg, result, results;
  results = [];
  for (i = 0, len = packages.length; i < len; i++) {
    pkg = packages[i];
    winston.info(pkg + ": Searching...");
    result = mcpm.install(pkg);
    if (result instanceof Error) {
      results.push(winston.error(pkg + ":", result));
    } else {
      results.push(void 0);
    }
  }
  return results;
});

commander.command("minecraft-version").alias("mc").description("display currently selected Minecraft version").action(function() {
  return console.log(mcpm.getMinecraftVersion());
});

commander.parse(process.argv);
