/* eslint-env mocha */

let proxyquire = require('proxyquire')
let chai = require('chai')
let { expect } = chai
let sinon = require('sinon')
chai.should()
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

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
    }
    )

    add(pathToZip, fakeManifest, function (err) {
      expect(err).to.equal(null)
      return done()
    }
    )

    fakeCopy.should.not.have.been.called
    return fakeOutputJson.should.not.have.been.called
  }
  )

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
    }
    )

    return add('path/to/src.zip', fakeManifest, function (err) {
      expect(err).to.equal(null)
      fakeCopy.verify()
      return done()
    }
    )
  }
  )

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
    }
    )

    return add('path/to/src.zip', fakeManifest, function (err) {
      err.should.be.an.instanceof(Error)
      fakeCopy.verify()
      return done()
    }
    )
  }
  )

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
    }
    )

    return add('path/to/src.zip', fakeManifest, function (err) {
      expect(err).to.equal(null)
      fakeOutputJson.verify()
      return done()
    }
    )
  }
  )

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
    }
    )

    return add('path/to/src.zip', fakeManifest, function (err) {
      err.should.be.an.instanceof(Error)
      fakeOutputJson.verify()
      return done()
    }
    )
  }
  )
}
)
