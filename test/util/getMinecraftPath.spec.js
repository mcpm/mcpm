/* eslint-env mocha */

let sinon = require('sinon')
let os = require('os')
let path = require('path')
let getMinecraftPath = require('../../lib/util/getMinecraftPath')

describe('util.getMinecraftPath', function () {
  it('returns path to the Minecraft directory', function () {
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
  })
})
