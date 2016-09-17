/* eslint-env mocha */

let proxyquire = require('proxyquire')
let chai = require('chai')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

describe('util.addInstalledPackage', function () {
  it("adds specified module to 'mcpmInstalledPackages'", function (done) {
    let addInstalledPackage = proxyquire('../../lib/util/addInstalledPackage', {
      './getCurrentProfile' () {
        return {
          originalInfo: {
            mcpmInstalledPackages: {
              'whatever': '1.2.3'
            }
          }
        }
      },
      './setCurrentProfile' (newProfile) {
        return newProfile.mcpmInstalledPackages.should.deep.equal({
          'whatever': '1.2.3',
          'fake-package': '0.1.0'
        })
      }
    }
    )

    return addInstalledPackage('fake-package', '0.1.0', function (err, result) {
      expect(err).to.equal(undefined)
      expect(result).to.equal(true)
      return done()
    }
    )
  }
  )

  it("adds 'mcpmInstalledPackages' field if it's not there yet", function (done) {
    let addInstalledPackage = proxyquire('../../lib/util/addInstalledPackage', {
      './getCurrentProfile' () {
        return {originalInfo: {}}
      },
      './setCurrentProfile' (newProfile) {
        '0.1.0'.should.equal(newProfile.mcpmInstalledPackages[ 'fake-package' ])
      }
    }
    )

    return addInstalledPackage('fake-package', '0.1.0', function (err, result) {
      expect(err).to.equal(undefined)
      expect(result).to.equal(true)
      return done()
    }
    )
  }
  )
}
)
