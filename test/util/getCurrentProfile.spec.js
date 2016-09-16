let proxyquire = require('proxyquire')
let chai = require('chai')
let sinon = require('sinon')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let path = require('path')
let fs = require('fs')

// cwd seems to be outside of test/
let pathToFixtures = path.resolve('test/fixtures')
let pathToTheFixture = path.join(pathToFixtures, 'launcher_profiles.json')

let loadFixture = () => JSON.parse(fs.readFileSync(pathToTheFixture, {encoding: 'utf-8'}))

let getCurrentProfile = proxyquire('../../lib/util/getCurrentProfile',
  {['./getMinecraftPath']() { return pathToFixtures; }})

describe('util.getCurrentProfile', function () {
  afterEach(function () {
    // Roll back the changes to make the tests stateless.
    let fixture = loadFixture()
    fixture.selectedProfile = '1.8 + Forge + LiteLoader'
    fixture.profiles[ '1.8 + Forge + LiteLoader' ].lastVersionId = '1.8.0'
    return fs.writeFileSync(pathToTheFixture, JSON.stringify(fixture, null, 2))
  })

  it('returns current profile in originalInfo property', function (done) {
    let fixture = loadFixture()
    let actualInfo = fixture.profiles[ '1.8 + Forge + LiteLoader' ]

    return getCurrentProfile(function (err, currentProfile) {
      expect(err).to.equal(undefined)
      actualInfo.should.deep.equal(currentProfile.originalInfo)
      return done()
    })
  }
  )

  it('returns current Minecraft version in version property', done => getCurrentProfile(function (err, currentProfile) {
    expect(err).to.equal(undefined)
    '1.8.0'.should.equal(currentProfile.version)
    return done()
  })

  )

  it("normalizes version to 'x.x.0' when specified as 'x.x'", function (done) {
    let fixture = loadFixture()
    fixture.profiles[ '1.8 + Forge + LiteLoader' ].lastVersionId = '1.8'
    fs.writeFileSync(pathToTheFixture, JSON.stringify(fixture))
    return getCurrentProfile(function (err, currentProfile) {
      expect(err).to.equal(undefined)
      '1.8.0'.should.equal(currentProfile.version)
      return done()
    })
  }
  )

  it('returns installed packages in installedPackages property', done => getCurrentProfile(function (err, currentProfile) {
    expect(err).to.equal(undefined)
    let packageList = {
      fake: '1.2.3',
      package: '2.3.4'
    }
    packageList.should.deep.equal(currentProfile.installedPackages)
    return done()
  })

  )

  return it('reloads profiles on each call', function (done) {
    let fixture = loadFixture()
    let actualInfo = fixture.profiles[ '1.8 + Forge + LiteLoader' ]

    return getCurrentProfile(function (err, currentProfile) {
      expect(err).to.equal(undefined)
      actualInfo.should.deep.equal(currentProfile.originalInfo)

      fixture.selectedProfile = '1.8'
      fs.writeFileSync(pathToTheFixture, JSON.stringify(fixture))
      actualInfo = fixture.profiles[ '1.8' ]

      return getCurrentProfile(function (err, currentProfile) {
        expect(err).to.equal(undefined)
        actualInfo.should.deep.equal(currentProfile.originalInfo)
        return done()
      })
    })
  }
  )
}
)
