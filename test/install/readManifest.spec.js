/* eslint-env mocha */

let expect = require('chai').expect
let path = require('path')
let readManifest = require('../../lib/install/readManifest')

describe('install.readManifest', function () {
  it('reads config inside package and returns its contents', function () {
    let result = readManifest(path.resolve('./test/fixtures/fake-mod'))
    result.should.be.a('string')
  })

  it('returns null when config not found', function () {
    let result = readManifest(path.resolve('./test/fixtures/404'))
    expect(result).to.equal(null)
  })
})
