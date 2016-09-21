/* eslint-env mocha */

let expect = require('chai').expect
let sinon = require('sinon')
let proxyquire = require('proxyquire')
let path = require('path')

describe('cache', function () {
  describe('get', function () {
    it("returns an Error when package name isn't specified", function (done) {
      let fakeExists = sinon.stub().throws()

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          exists: fakeExists
        }
      })

      cache.get(undefined, undefined, function (err, result) {
        err.should.be.an.instanceof(Error)
        done()
      })
    })

    let names = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
    names.forEach(name => it(`returns an Error when package name isn't valid: ${name}`, function (done) {
      let fakeExists = sinon.stub().throws()

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          exists: fakeExists
        }
      })

      cache.get(name, '1.0.0', function (err, result) {
        err.should.be.an.instanceof(Error)
        done()
      })
    })
    )

    it("returns an Error when specified version isn't semantic", function (done) {
      let fakeExists = sinon.stub().throws()

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          exists: fakeExists
        },
        'semver': {
          valid () { return false }
        }
      })

      cache.get('whatever', 'this is not a valid version', function (err, result) {
        err.should.be.an.instanceof(Error)
        done()
      })
    })

    it("when the version is semantic, return an Error if it's not cached", function (done) {
      let pathToZip = path.join('fake-.mcpm', 'cache', 'whatever', '1.0.0', 'mcpm-package.zip')
      let fakeExists = sinon.mock()
        .once()
        .withArgs(pathToZip, sinon.match.func)
        .callsArgWithAsync(1, false)

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          exists: fakeExists
        }
      })

      cache.get('whatever', '1.0.0', function (err, result) {
        err.should.be.an.instanceof(Error)
        fakeExists.verify()
        done()
      })
    })

    it('when the version is semantic, return path to zip if it exists', function (done) {
      let pathToZip = path.join('fake-.mcpm', 'cache', 'whatever', '1.0.0', 'mcpm-package.zip')
      let fakeExists = sinon.mock()
        .once()
        .withArgs(pathToZip, sinon.match.func)
        .callsArgWithAsync(1, true)

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          exists: fakeExists
        }
      })

      cache.get('whatever', '1.0.0', function (err, result) {
        expect(err).to.equal(null)
        result.should.equal(pathToZip)
        fakeExists.verify()
        done()
      })
    })
  })

  describe('add', function () {
    it("doesn't do anything when trying to cache the cached zip itself", function (done) {
      let fakeManifest = {
        name: 'fake-package',
        version: '1.2.3'
      }
      let dest = path.join('fake-.mcpm', 'cache', fakeManifest.name, fakeManifest.version)
      let pathToZip = path.join(dest, 'mcpm-package.zip')

      let fakeCopy = sinon.stub()
      let fakeOutputJson = sinon.stub()

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          copy: fakeCopy,
          outputJson: fakeOutputJson
        }
      })

      cache.add(pathToZip, fakeManifest, function (err) {
        expect(err).to.equal(null)
        done()
      })

      fakeCopy.should.not.have.been.called
      fakeOutputJson.should.not.have.been.called
    })

    it('adds specified zip to cache', function (done) {
      let dest = path.join('fake-.mcpm', 'cache', 'fake-package', '1.2.3')
      let fakeManifest = {
        name: 'fake-package',
        version: '1.2.3'
      }

      let fakeCopy = sinon.mock()
        .once()
        .withArgs('path/to/src.zip', path.join(dest, 'mcpm-package.zip'), sinon.match.func)
        .callsArgAsync(2)

      let fakeOutputJson = sinon.stub()
        .callsArgAsync(2)

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          copy: fakeCopy,
          outputJson: fakeOutputJson
        }
      })

      cache.add('path/to/src.zip', fakeManifest, function (err) {
        expect(err).to.equal(null)
        fakeCopy.verify()
        done()
      })
    })

    it('returns an Error when fs.copy fails', function (done) {
      let fakeManifest = {
        name: 'fake-package',
        version: '1.2.3'
      }

      let fakeCopy = sinon.mock()
        .once()
        .callsArgWithAsync(2, new Error('Oh, snap!'))

      let fakeOutputJson = sinon.stub()
        .throws()

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          copy: fakeCopy,
          outputJson: fakeOutputJson
        }
      })

      cache.add('path/to/src.zip', fakeManifest, function (err) {
        err.should.be.an.instanceof(Error)
        fakeCopy.verify()
        done()
      })
    })

    it('adds the package manifest to cache', function (done) {
      let dest = path.join('fake-.mcpm', 'cache', 'fake-package', '1.2.3')
      let fakeManifest = {
        name: 'fake-package',
        version: '1.2.3'
      }

      let fakeCopy = sinon.stub()
        .callsArgAsync(2)

      let fakeOutputJson = sinon.mock()
        .once()
        .withArgs(path.join(dest, 'mcpm-package.json'), fakeManifest)
        .callsArgAsync(2)

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          copy: fakeCopy,
          outputJson: fakeOutputJson
        }
      })

      cache.add('path/to/src.zip', fakeManifest, function (err) {
        expect(err).to.equal(null)
        fakeOutputJson.verify()
        done()
      })
    })

    it('returns an Error when fs.outputJson fails', function (done) {
      let dest = path.join('fake-.mcpm', 'cache', 'fake-package', '1.2.3')
      let fakeManifest = {
        name: 'fake-package',
        version: '1.2.3'
      }

      let fakeCopy = sinon.stub()
        .callsArgAsync(2)

      let fakeOutputJson = sinon.mock()
        .once()
        .withArgs(path.join(dest, 'mcpm-package.json'), fakeManifest)
        .callsArgWithAsync(2, new Error('Oh, snap!'))

      let cache = proxyquire('../lib/cache', {
        './util': {
          getPathToMcpmDir () { return 'fake-.mcpm' }
        },
        'fs-extra': {
          copy: fakeCopy,
          outputJson: fakeOutputJson
        }
      })

      cache.add('path/to/src.zip', fakeManifest, function (err) {
        err.should.be.an.instanceof(Error)
        fakeOutputJson.verify()
        done()
      })
    })
  })
})

