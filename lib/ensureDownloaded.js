let fs = require('fs')
let tmp = require('tmp-promise')
let got = require('got')

module.exports = function ensureUnzipped (pathToArchive) {
  if (!/https?:\/\//i.test(pathToArchive)) return Promise.resolve(pathToArchive)

  return tmp.file({prefix: 'mcpm-', postfix: '.zip'})
  .then(tempFile => new Promise((resolve, reject) => {
    console.log(`Downloading to ${tempFile.path}`)
    got.stream(pathToArchive)
      .pipe(fs.createWriteStream(tempFile.path))
      .on('close', () => {
        console.log(`Looks like downloaded`)
        resolve(tempFile.path)
      })
  }))
}
