let semver = require('semver')
let path = require('path')
let fs = require('fs-extra')
let getPathToMcpmDir = require('./util/getPathToMcpmDir')

function add (pathToZip, manifest, callback) {
  let pathToPackageCache = path.join(getPathToMcpmDir(), 'cache', manifest.name, manifest.version)
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

function get (name, version, callback) {
  if (!name || !/^[a-z]([\w-]*[a-z])?$/i.test(name)) {
    return callback(new Error('Invalid package name!'))
  }

  if (!semver.valid(version)) {
    return callback(new Error('Invalid package version!'))
  }

  let pathToMcpm = getPathToMcpmDir()
  let pathToZip = path.join(pathToMcpm, 'cache', name, version, 'mcpm-package.zip')
  fs.exists(pathToZip, isFound => {
    if (isFound) callback(null, pathToZip)
    else callback(new Error("Can't find specified package in the cache!"))
  })
}

module.exports = {
  add,
  get
}
