#!/usr/bin/env node

let commander = require('commander')
let winston = require('winston')
let async = require('async')
let install = require('../lib/install')
let getCurrentProfile = require('../lib/util/getCurrentProfile')
let getClientVersion = require('../lib/util/getClientVersion')

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
    getCurrentProfile().then(startProfile => {
      winston.info(`Current Minecraft version: ${startProfile.version}`)
      winston.info(`Current profile name: ${startProfile.originalInfo.name}`)
      console.log()

      async.forEachSeries(packages, (pkg, done) => {
        winston.info(`Installing ${pkg}`)
        install(pkg)
        .then(() => done())
        .catch(error => {
          winston.error(`${pkg}: ${error.name}: ${error.message}`)
          done(error)
        })
      }, (error) => {
        if (error) return winston.error(`Something went wrong! ${error.message}`)

        winston.info('Done!')
        getCurrentProfile().then(endProfile => {
          if ((endProfile.version !== startProfile.version) ||
            (endProfile.originalInfo.name !== startProfile.originalInfo.name)) {
            console.log()
            winston.info(`Current Minecraft version: ${endProfile.version}`)
            winston.info(`Current profile name: ${endProfile.originalInfo.name}`)
          }
        })
      })
    })
  })

commander
  .command('minecraft-version')
  .alias('mc')
  .description('display currently selected Minecraft version')
  .action(function () {
    getClientVersion().then(version => console.log(version))
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
