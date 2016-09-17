/* eslint-env mocha */

let proxyquire = require('proxyquire')
let chai = require('chai')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let path = require('path')

// cwd seems to be outside of test/
let pathToFixtures = path.resolve('test/fixtures')
let pathToTheFixture = path.join(pathToFixtures, 'launcher_profiles.json')
let profileName = '1.8 + Forge + LiteLoader'
let fakeNewProfile = {whatever: 5}

describe('util.setCurrentProfile', function () {
  it('returns an Error when writeFile fails', function (done) {
    let setCurrentProfile = proxyquire('../../lib/util/setCurrentProfile', {
      './getMinecraftPath' () {
        return pathToFixtures
      },
      'fs': {
        writeFile (filename, json, callback) {
          filename.should.equal(pathToTheFixture)
          JSON.parse(json)
          return callback('fake-result')
        }
      }
    }
    )

    return setCurrentProfile(fakeNewProfile, function (err) {
      expect(err).to.equal('fake-result')
      return done()
    }
    )
  }
  )

  it('blindly rewrites current profile with specified object', function (done) {
    let triedToWriteThis = {}
    let setCurrentProfile = proxyquire('../../lib/util/setCurrentProfile', {
      './getMinecraftPath' () {
        return pathToFixtures
      },
      'fs': {
        writeFile (filename, json, callback) {
          filename.should.equal(pathToTheFixture)
          triedToWriteThis = JSON.parse(json)
          return callback()
        }
      }
    }
    )

    return setCurrentProfile(fakeNewProfile, function (err) {
      expect(err).to.equal(undefined)
      triedToWriteThis.profiles[ profileName ].should.deep.equal(fakeNewProfile)
      return done()
    }
    )
  }
  )
}
)
