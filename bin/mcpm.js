#!/usr/bin/env node

let commander = require('commander')
let winston = require('winston')
let install = require('../lib/install')
let util = require('../lib/util')

winston.setLevels(winston.config.cli.levels)
winston.cli()

let verbosityLevels = [ 'info', 'debug', 'verbose', 'silly' ]
let increaseVerbosity = function (v, total) {
  winston.level = verbosityLevels[total]
  return total + (total < verbosityLevels.length - 1)
}

commander
  .version(require('../package.json').version)
  .option('-v, --verbose', 'increase verbosity', increaseVerbosity, 0)

commander
  .command('install <packages...>')
  .alias('i')
  .description('install one or more packages')
  .action(packages => {
    let startProfile = util.getCurrentProfile()
    winston.info(`Current Minecraft version: ${startProfile.version}`)
    winston.info(`Current profile name: ${startProfile.originalInfo.name}`)
    console.log()

    packages.forEach(pkg => {
      let result = install(pkg)
      if (result instanceof Error) {
        winston.error(`${pkg}: ${result.name}: ${result.message}`)
      }
    })

    let endProfile = util.getCurrentProfile()
    if ((endProfile.version !== startProfile.version) ||
      (endProfile.originalInfo.name !== startProfile.originalInfo.name)) {
      console.log()
      winston.info(`Current Minecraft version: ${endProfile.version}`)
      return winston.info(`Current profile name: ${endProfile.originalInfo.name}`)
    }
  })

commander
  .command('minecraft-version')
  .alias('mc')
  .description('display currently selected Minecraft version')
  .action(function () {
    util.getClientVersion(version => console.log(version))
  })

commander.on('--help', () => console.log([
  '  Examples:',
  '',
  '    Install a package from the ./foo directory',
  '      $ mcpm install ./foo',
  '',
  '    Install a package from the ./foo.zip archive',
  '      $ mcpm install ./foo.zip',
  '',
  '    Install a package from cache',
  '      $ mcpm install foo@0.2.0',
  '',
  '    Show the Minecraft version of the currently selected profile',
  '      $ mcpm mc'
].join('\n')
)

)

commander
  .parse(process.argv)
