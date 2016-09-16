let proxyquire = require('proxyquire')
let chai = require('chai')
let sinon = require('sinon')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let path = require('path')

describe('install.copyFiles', function () {
  it('safely copies files and folders using fs-extra#copy', function (done) {
    let copyFiles = proxyquire('../../lib/install/copyFiles', {
      '../util': {
        getMinecraftPath() { return 'mcpath'; }
      },
      'fs-extra': {
        copy(from, to, callback) {
          if (from.includes('from.file')) {
            to.should.equal(path.join('mcpath', 'foo/bar/to/from.file'))
          } else {
            to.should.equal(path.join('mcpath', 'foo/bar/to/dir'))
          }
          return setTimeout(callback)
        }
      }
    }
    )

    return copyFiles({
      fileList: {
        'foo/bar/to': [ 'whatever/from.file', 'whatever/from/dir' ]
      },
      packageRoot: 'pkgpath',
      callback(err) {
        expect(err).to.equal(null)
        return done()
      }
    })
  }
  )

  it('copies the package zip when trying to copy it', function (done) {
    let copyFiles = proxyquire('../../lib/install/copyFiles', {
      '../util': {
        getMinecraftPath() { return 'mcpath'; }
      },
      'fs-extra': {
        copy(from, to, callback) {
          from.should.equal('/fake/path/to/package.zip')
          to.should.equal(path.join('mcpath', 'foo/bar/to/package.zip'))
          return setTimeout(callback)
        }
      }
    }
    )

    return copyFiles({
      fileList: {
        'foo/bar/to': [ '/fake/path/to/package.zip' ]
      },
      packageRoot: 'pkgpath',
      zipPath: '/fake/path/to/package.zip',
      callback(err) {
        expect(err).to.equal(null)
        return done()
      }
    })
  }
  )

  return it('returns an error if fs.copy fails', function (done) {
    let copyFiles = proxyquire('../../lib/install/copyFiles', {
      '../util': {
        getMinecraftPath() { return 'mcpath'; }
      },
      'fs-extra': {
        copy(from, to, callback) {
          return setTimeout(() => callback(new Error('Oh, snap!')))
        }
      }
    }
    )

    return copyFiles({
      fileList: {
        'oh': [ 'snap' ]
      },
      packageRoot: 'pkgpath',
      callback(err) {
        err.should.be.an.instanceof(Error)
        return done()
      }
    })
  }
  )
}
)
