let fs = require('fs-extra')
let path = require('path')
let util = require('../util')
let async = require('async')
let winston = require('winston')

let copyFiles = function ({ fileList, packageRoot, zipPath, callback }) {
  winston.verbose('install.copyFiles: starting')
  let minecraftRoot = util.getMinecraftPath()
  winston.silly(`install.copyFiles: got path to Minecraft root: ${minecraftRoot}`)
  return async.forEachOfSeries(fileList, (fromList, to, doneList) => async.eachSeries(fromList, function (from, doneOne) {
    winston.silly(`install.copyFiles: next from: ${from}`)
    let absoluteFrom = (from === zipPath) ? from : path.join(packageRoot, from)
    winston.silly(`install.copyFiles: absoluteFrom: ${absoluteFrom}`)
    let absoluteTo = path.join(minecraftRoot, to, path.basename(from))
    winston.verbose(`install.copyFiles: absoluteTo: ${absoluteTo}`)
    return fs.copy(absoluteFrom, absoluteTo, doneOne)
  }
    , err => doneList(err)
  )

    , function (err = null) {
      winston.verbose('install.copyFiles: finished copying')
      return callback(err)
    }
  )
}

module.exports = copyFiles
