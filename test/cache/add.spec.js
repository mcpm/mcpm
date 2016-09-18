/* eslint-env mocha */

let expect = require('chai').expect
let sinon = require('sinon')
let proxyquire = require('proxyquire')
let path = require('path')

describe('cache.add', function () {
  it("doesn't do anything when trying to cache the cached zip itself", function (done) {
    let fakeManifest = {
      name: 'fake-package',
      version: '1.2.3'
    }
    let dest = path.join('fake-.mcpm', 'cache', fakeManifest.name, fakeManifest.version)
    let pathToZip = path.join(dest, 'mcpm-package.zip')

    let fakeCopy = sinon.stub()
    let fakeOutputJson = sinon.stub()

    let add = proxyquire('../../lib/cache/add', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        copy: fakeCopy,
        outputJson: fakeOutputJson
      }
    })

    add(pathToZip, fakeManifest, function (err) {
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

    let add = proxyquire('../../lib/cache/add', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        copy: fakeCopy,
        outputJson: fakeOutputJson
      }
    })

    add('path/to/src.zip', fakeManifest, function (err) {
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

    let add = proxyquire('../../lib/cache/add', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        copy: fakeCopy,
        outputJson: fakeOutputJson
      }
    })

    add('path/to/src.zip', fakeManifest, function (err) {
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

    let add = proxyquire('../../lib/cache/add', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        copy: fakeCopy,
        outputJson: fakeOutputJson
      }
    })

    add('path/to/src.zip', fakeManifest, function (err) {
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

    let add = proxyquire('../../lib/cache/add', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        copy: fakeCopy,
        outputJson: fakeOutputJson
      }
    })

    add('path/to/src.zip', fakeManifest, function (err) {
      err.should.be.an.instanceof(Error)
      fakeOutputJson.verify()
      done()
    })
  })
})
