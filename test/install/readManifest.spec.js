/* eslint-env mocha */

let chai = require('chai')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let readManifest = require('../../lib/install/readManifest')

let path = require('path')

describe('install.readManifest', function () {
  it('reads config inside package and returns its contents', function () {
    let result = readManifest(path.resolve('./test/fixtures/fake-mod'))
    return result.should.be.a('string')
  }
  )

  it('returns null when config not found', function () {
    let result = readManifest(path.resolve('./test/fixtures/404'))
    return expect(result).to.equal(null)
  }
  )
}
)
