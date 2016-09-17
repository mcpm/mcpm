/* eslint-env mocha */

let proxyquire = require('proxyquire').noPreserveCache()
let chai = require('chai')
let sinon = require('sinon')
chai.should()
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

describe('install.fromCache', function () {
  it("returns an Error when 'cache.get' returns null", function () {
    let fakeFromZip = sinon.stub()
    let fakeCacheGet = sinon.stub().returns(null)

    let fromCache = proxyquire('../../lib/install/fromCache', {
      './fromZip': fakeFromZip,
      '../cache': {
        get: fakeCacheGet
      }
    }
    )

    let result = fromCache('name', 'version')
    result.should.be.an.instanceof(Error)

    fakeCacheGet.should.have.been.calledOnce
    return fakeFromZip.should.not.have.been.called
  }
  )

  it("delegates installation to 'fromZip', returns its result", function () {
    let fakeFromZip = sinon.stub().returns('fake-result')
    let fakeCacheGet = sinon.stub().returns('path/to/fake.zip')

    let fromCache = proxyquire('../../lib/install/fromCache', {
      './fromZip': fakeFromZip,
      '../cache': {
        get: fakeCacheGet
      }
    }
    )

    let result = fromCache('name', 'version')
    result.should.equal('fake-result')

    fakeCacheGet.should.have.been.calledOnce
    return fakeFromZip.should.have.been.calledOnce
  }
  )
}
)
