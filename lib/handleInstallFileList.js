let flattenFileList = require('./install/flattenFileList')
let copyFiles = require('./install/copyFiles')

module.exports = function handleInstallFileList (fileList, folderPath, zipPath) {
  if (!fileList) return Promise.resolve()

  return flattenFileList(fileList, folderPath, zipPath)
  .then(fileList => copyFiles(fileList, folderPath, zipPath))
}
