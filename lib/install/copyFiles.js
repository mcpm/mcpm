let fs = require('fs-extra')
let path = require('path')
let async = require('async')
let winston = require('winston')
let getMinecraftPath = require('../util/getMinecraftPath')

function copyFiles ({fileList, packageRoot, zipPath, callback}) {
  let minecraftRoot = getMinecraftPath()

  return async.forEachOfSeries(fileList, (fromList, to, done) => {
    async.eachSeries(fromList, (from, done) => {
      let absoluteFrom = (from === zipPath) ? from : path.join(packageRoot, from)
      let absoluteTo = path.join(minecraftRoot, to, path.basename(from))

      winston.verbose(`install.copyFiles: copying from ${from} (${absoluteFrom}) to ${to} (${absoluteTo})`)

      return fs.copy(absoluteFrom, absoluteTo, done)
    }, done)
  }, callback)
}

module.exports = copyFiles
