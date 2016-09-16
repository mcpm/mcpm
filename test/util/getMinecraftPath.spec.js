let chai = require('chai')
let sinon = require('sinon')
chai.should()
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let getMinecraftPath = require('../../lib/util/getMinecraftPath')

let os = require('os')
let path = require('path')

describe('util.getMinecraftPath', () => it('returns path to the Minecraft directory', function () {
  let originalHome = process.env.HOME
  process.env.HOME = 'fakeHome'

  let fakeOsPlatform = null
  sinon.stub(os, 'platform', () => fakeOsPlatform)

  fakeOsPlatform = 'win32'
  getMinecraftPath().should.equal(path.join('fakeHome',
    'AppData', 'Roaming', '.minecraft')
  )

  fakeOsPlatform = 'linux'
  getMinecraftPath().should.equal(path.join('fakeHome',
    '.minecraft')
  )

  fakeOsPlatform = 'darwin'
  getMinecraftPath().should.equal(path.join('fakeHome',
    'Library', 'Application Support', 'minecraft')
  )

  process.env.HOME = originalHome
  return os.platform.restore()
}
)

)
