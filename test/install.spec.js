/* eslint-env mocha */

let sinon = require('sinon')
let proxyquire = require('proxyquire')

describe('install', function () {
  it('rejects when parsePackageString returns null', function (done) {
    let fakeParsePackageString = sinon.stub().returns(null)

    let install = proxyquire('../lib/install',
      {'./install/parsePackageString': fakeParsePackageString})

    install('whatever').then(() => {
      done(new Error('Should have rejected!'))
    }, (err) => {
      err.should.be.instanceof(Error)
      done()
    })
  })

  it("calls install.fromFolder when package is of 'folder' type", function (done) {
    let install = proxyquire('../lib/install', {
      './install/parsePackageString': (str) => {
        str.should.equal('fake-str')
        return {type: 'folder', name: 'fake-name'}
      },
      './install/fromFolder': (name) => {
        name.should.equal('fake-name')
        return Promise.resolve()
      }
    })

    install('fake-str').then(done)
  })

  it("calls install.fromZip when package is of 'zip' type", function (done) {
    let install = proxyquire('../lib/install', {
      './install/parsePackageString': (str) => {
        str.should.equal('fake-str')
        return {type: 'zip', name: 'fake-name'}
      },
      './install/fromZip': (name) => {
        name.should.equal('fake-name')
        return Promise.resolve()
      }
    })

    install('fake-str').then(done)
  })

  it("calls install.fromCache when package is of 'cache' type", function (done) {
    let install = proxyquire('../lib/install', {
      './install/parsePackageString': (str) => {
        str.should.equal('fake-str')
        return {type: 'cache', name: 'fake-name', version: 'fake-version'}
      },
      './install/fromCache': (name, version) => {
        name.should.equal('fake-name')
        version.should.equal('fake-version')
        return Promise.resolve()
      }
    })

    install('fake-str').then(done)
  })
})
