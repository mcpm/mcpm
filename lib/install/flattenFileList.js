let _ = require('lodash')
let path = require('path')
let glob = require('glob')

function flattenFileList (list, unpackedPath, zipPath) {
  if (!unpackedPath) {
    return new Error('Package directory not specified!')
  }

  let flattened = _(list)
    .mapValues(_.castArray)
    .mapValues(globList => _.map(globList, oneGlob => {
      if (oneGlob === '@') return zipPath
      return glob.sync(oneGlob, {cwd: unpackedPath})
    }))
    .mapValues(_.flatten)
    .mapValues(_.compact)
    .mapValues(fileList => _.map(fileList, path.normalize))
    .omitBy(_.isEmpty)
    .transform((result, fromList, toKey) => {
      let normalizedTo = path.normalize(toKey)
      result[normalizedTo] = (result[normalizedTo] || []).concat(fromList)
    })
    .mapValues(_.uniq)
    .value()

  let keys = _.keys(flattened)
  if (_.some(keys, key => key.startsWith(`..${path.sep}`) || key === '..')) {
    return new Error('Trying to copy to outside of Minecraft!')
  } else if (_.some(keys, path.isAbsolute)) {
    return new Error('Trying to copy to an absolute path!')
  }

  let files = _.flatten(_.values(flattened))
  if (_.some(files, file => file.startsWith(`..${path.sep}`) || file === '..')) {
    return new Error('Trying to copy from outside of the package!')
  } else if (_.some(files, path.isAbsolute)) {
    return new Error('Trying to copy from an absolute path!')
  }

  return flattened
}

module.exports = flattenFileList
