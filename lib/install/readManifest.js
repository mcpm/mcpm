let fs = require('fs-extra')
let path = require('path')

function readManifest (packageDirectory) {
  try {
    let filename = path.join(packageDirectory, 'mcpm-package.json')
    return fs.readFileSync(filename, {encoding: 'utf-8'})
  } catch (error) {
    return null
  }
}

module.exports = readManifest
