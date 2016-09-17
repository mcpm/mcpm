let path = require('path')
let fs = require('fs-extra')
let util = require('../util')

function add (pathToZip, manifest, callback) {
  let pathToPackageCache = path.join(util.getPathToMcpmDir(), 'cache', manifest.name, manifest.version)
  let manifestFilename = path.join(pathToPackageCache, 'mcpm-package.json')
  let targetPathToZip = path.join(pathToPackageCache, 'mcpm-package.zip')

  if (targetPathToZip === pathToZip) return callback(null)

  fs.copy(pathToZip, targetPathToZip, err => {
    if (err) return callback(err)
    fs.outputJson(manifestFilename, manifest, err => {
      callback(err || null)
    })
  })
}

module.exports = add
