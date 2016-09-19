/* eslint-env mocha */

let proxyquire = require('proxyquire')

let getClientVersion = proxyquire('../../lib/util/getClientVersion', {
  './getCurrentProfile' (callback) {
    callback(null, {version: 'fake-version'})
  }
})

describe('util.getClientVersion', function () {
  it("returns 'getCurrentProfile().version'", function (done) {
    getClientVersion(function (result) {
      'fake-version'.should.equal(result)
      done()
    })
  })
})
