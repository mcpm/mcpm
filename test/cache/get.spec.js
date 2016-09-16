let proxyquire = require('proxyquire')
let chai = require('chai')
let sinon = require('sinon')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let path = require('path')

describe('cache.get', function () {
  it("returns an Error when package name isn't specified", function (done) {
    let fakeExists = sinon.stub().throws()

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir() { return 'fake-.mcpm'; }
      },
      'fs-extra': {
        exists: fakeExists
      }
    }
    )

    return get(undefined, undefined, function (err, result) {
      err.should.be.an.instanceof(Error)
      return done()
    }
    )
  }
  )

  let iterable = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  for (let i = 0; i < iterable.length; i++) {
    let name = iterable[i](name => it(`returns an Error when package name isn't valid: ${name}`, function (done) {
      let fakeExists = sinon.stub().throws()

      let get = proxyquire('../../lib/cache/get', {
        '../util': {
          getPathToMcpmDir() { return 'fake-.mcpm'; }
        },
        'fs-extra': {
          exists: fakeExists
        }
      }
      )

      return get(name, '1.0.0', function (err, result) {
        err.should.be.an.instanceof(Error)
        return done()
      }
      )
    }
    )
    )(name)
  }

  it("returns an Error when specified version isn't semantic", function (done) {
    let fakeExists = sinon.stub().throws()

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir() { return 'fake-.mcpm'; }
      },
      'fs-extra': {
        exists: fakeExists
      },
      'semver': {
        valid() { return false; }
      }
    }
    )

    return get('whatever', 'this is not a valid version', function (err, result) {
      err.should.be.an.instanceof(Error)
      return done()
    }
    )
  }
  )

  it("when the version is semantic, return an Error if it's not cached", function (done) {
    let pathToZip = path.join('fake-.mcpm', 'cache', 'whatever', '1.0.0', 'mcpm-package.zip')
    let fakeExists = sinon.mock()
      .once()
      .withArgs(pathToZip, sinon.match.func)
      .callsArgWithAsync(1, false)

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir() { return 'fake-.mcpm'; }
      },
      'fs-extra': {
        exists: fakeExists
      }
    }
    )

    return get('whatever', '1.0.0', function (err, result) {
      err.should.be.an.instanceof(Error)
      fakeExists.verify()
      return done()
    }
    )
  }
  )

  return it('when the version is semantic, return path to zip if it exists', function (done) {
    let pathToZip = path.join('fake-.mcpm', 'cache', 'whatever', '1.0.0', 'mcpm-package.zip')
    let fakeExists = sinon.mock()
      .once()
      .withArgs(pathToZip, sinon.match.func)
      .callsArgWithAsync(1, true)

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir() { return 'fake-.mcpm'; }
      },
      'fs-extra': {
        exists: fakeExists
      }
    }
    )

    return get('whatever', '1.0.0', function (err, result) {
      expect(err).to.equal(null)
      result.should.equal(pathToZip)
      fakeExists.verify()
      return done()
    }
    )
  }
  )
}
)
