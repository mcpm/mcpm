let proxyquire = require('proxyquire')
let chai = require('chai')
let sinon = require('sinon')
chai.should()
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let getClientVersion = proxyquire('../../lib/util/getClientVersion', {
  ['./getCurrentProfile'](callback) {
    return callback({version: 'fake-version'})
  }
}
)

describe('util.getClientVersion', () => it("returns 'getCurrentProfile().version'", done => getClientVersion(function (result) {
  'fake-version'.should.equal(result)
  return done()
})

)

)
