let path = require('path')
let glob = require('glob')
let winston = require('winston')

let flattenGlobList = function (globList) {
  winston.silly('install.flattenFileList: flattening glob list')
  let flattenedGlobList = []
  for (let toWhere in globList) {
    let fromGlob = globList[toWhere]
    if (Array.isArray(fromGlob)) {
      winston.silly('install.flattenFileList: flattening glob:', fromGlob)
      for (let i = 0; i < fromGlob.length; i++) {
        let individualGlob = fromGlob[i]
        flattenedGlobList.push([ toWhere, individualGlob ])
      }
    } else {
      flattenedGlobList.push([ toWhere, fromGlob ])
    }
  }
  winston.silly('install.flattenFileList: flattened glob list')
  return flattenedGlobList
}

let globToFileList = function (fromGlob, unpackedPath, zipPath) {
  let fileList = []

  if (fromGlob === '@') {
    if (zipPath) {
      winston.verbose('install.flattenFileList: adding @ to list:', zipPath)
      fileList.push(zipPath)
    } else {
      winston.verbose('install.flattenFileList: ignoring @, no zipPath')
    }
    return fileList
  }

  let expandedGlob = glob.sync(fromGlob, {cwd: unpackedPath})
  winston.silly('install.flattenFileList: expanded glob', expandedGlob)

  for (let i = 0; i < expandedGlob.length; i++) {
    let filePath = expandedGlob[i]
    winston.silly('install.flattenFileList: next path', filePath)
    let normalizedFilePath = path.posix.normalize(filePath)
    winston.silly('install.flattenFileList: normalized: ' +
      normalizedFilePath
    )

    if ((normalizedFilePath.startsWith(`..${path.sep}`)) ||
      (normalizedFilePath === '..')) {
      winston.debug('install.flattenFileList: trying to copy ' +
        'from outside of the package, returning error'
      )
      return new Error('Trying to copy from outside of the package!')
    }
    if (path.isAbsolute(normalizedFilePath)) {
      winston.debug('install.flattenFileList: trying to copy ' +
        'from an absolute path, returning error'
      )
      return new Error('Trying to copy from an absolute path!')
    }

    fileList.push(normalizedFilePath)
    winston.verbose('install.flattenFileList: added to the list: ' +
      normalizedFilePath
    )
  }

  return fileList
}

let flattenFileList = function (list, unpackedPath, zipPath) {
  winston.verbose('install.flattenFileList: starting')
  if (!unpackedPath) {
    winston.debug('install.flattenFileList: unpackedPath not specified, returning error')
    return new Error('Package directory not specified!')
  }
  winston.silly('install.flattenFileList: unpackedPath specified')

  let flattenedGlobList = flattenGlobList(list)

  let flattened = {}

  for (let i = 0; i < flattenedGlobList.length; i++) {
    let [toWhere, fromGlob] = flattenedGlobList[i]
    winston.verbose('install.flattenFileList: next glob', { toWhere, fromGlob })
    let normalizedToWhere = path.posix.normalize(toWhere)
    winston.silly('install.flattenFileList: normalizedToWhere: ' +
      normalizedToWhere
    )

    if ((normalizedToWhere.startsWith(`..${path.sep}`)) ||
      (normalizedToWhere === '..')) {
      winston.debug('install.flattenFileList: trying to copy to ' +
        'outside of Minecraft, returning error'
      )
      return new Error('Trying to copy to outside of Minecraft!')
    }
    if (path.isAbsolute(normalizedToWhere)) {
      winston.debug('install.flattenFileList: trying to copy to ' +
        'an absolute path, returning error'
      )
      return new Error('Trying to copy to an absolute path!')
    }

    let fileList = globToFileList(fromGlob, unpackedPath, zipPath)
    if (fileList instanceof Error) {
      return fileList
    }

    if (flattened[ normalizedToWhere ] == null) { flattened[normalizedToWhere] = [] }
    flattened[ normalizedToWhere ] = flattened[ normalizedToWhere ].concat(fileList)
  }

  winston.silly('install.flattenFileList: flattened', flattened)
  return flattened
}

module.exports = flattenFileList
