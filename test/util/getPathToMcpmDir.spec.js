let proxyquire = require('proxyquire')
let chai = require('chai')
let sinon = require('sinon')
chai.should()
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let path = require('path')

describe('util.getPathToMcpmDir', () => it("returns '%APPDATA%/.mcpm'", function () {
  let getPathToMcpmDir = proxyquire('../../lib/util/getPathToMcpmDir',
    {['user-settings-dir']() { return 'fake-dir'; }})

  let result = getPathToMcpmDir()

  return result.should.equal(path.join('fake-dir', '.mcpm'))
}
)

)
