/* eslint-env mocha */

let expect = require('chai').expect
let sinon = require('sinon')
let proxyquire = require('proxyquire')
let path = require('path')

describe('cache.get', function () {
  it("returns an Error when package name isn't specified", function (done) {
    let fakeExists = sinon.stub().throws()

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        exists: fakeExists
      }
    })

    get(undefined, undefined, function (err, result) {
      err.should.be.an.instanceof(Error)
      done()
    })
  })

  let names = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  names.forEach(name => it(`returns an Error when package name isn't valid: ${name}`, function (done) {
    let fakeExists = sinon.stub().throws()

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        exists: fakeExists
      }
    })

    get(name, '1.0.0', function (err, result) {
      err.should.be.an.instanceof(Error)
      done()
    })
  })
  )

  it("returns an Error when specified version isn't semantic", function (done) {
    let fakeExists = sinon.stub().throws()

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        exists: fakeExists
      },
      'semver': {
        valid () { return false }
      }
    })

    get('whatever', 'this is not a valid version', function (err, result) {
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

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        exists: fakeExists
      }
    })

    get('whatever', '1.0.0', function (err, result) {
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

    let get = proxyquire('../../lib/cache/get', {
      '../util': {
        getPathToMcpmDir () { return 'fake-.mcpm' }
      },
      'fs-extra': {
        exists: fakeExists
      }
    })

    get('whatever', '1.0.0', function (err, result) {
      expect(err).to.equal(null)
      result.should.equal(pathToZip)
      fakeExists.verify()
      done()
    })
  })
})
