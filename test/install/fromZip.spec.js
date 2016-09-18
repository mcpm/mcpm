/* eslint-env mocha */

let sinon = require('sinon')
let proxyquire = require('proxyquire')

describe('install.fromZip', function () {
  it('returns an Error when the target is actually a folder', function () {
    let fromZip = require('../../lib/install/fromZip')

    let result = fromZip('test/fixtures/fake-mod')
    result.should.be.an.instanceof(Error)
  })

  it('returns an Error when the file is not a zip', function () {
    let fromZip = require('../../lib/install/fromZip')

    let result = fromZip('test/fixtures/not-a-zip.zip')
    result.should.be.an.instanceof(Error)
  })

  it("returns an Error when there's no manifest file in the zip", function () {
    let fromZip = require('../../lib/install/fromZip')

    let result = fromZip('test/fixtures/empty.zip')
    result.should.be.an.instanceof(Error)
  })

  it('returns an Error when adm-zip returns an error', function () {
    let getEntryStub = sinon.stub().returns({})
    let extractAllToStub = sinon.stub().returns(new Error())

    let fromZip = proxyquire('../../lib/install/fromZip', {
      'fs': {
        statSync () {
          return {isFile () { return true }}
        }
      },
      'tmp': {
        dirSync () {
          return {name: 'fake-temp-dir'}
        }
      },
      'adm-zip': function FakeAdmZip () {
        this.getEntry = getEntryStub
        this.extractAllTo = extractAllToStub
      }
    })

    let result = fromZip('fake-path-to-zip')
    result.should.be.an.instanceof(Error)

    getEntryStub.should.have.been.called
    extractAllToStub.should.have.been.calledOnce
  })

  it('returns an Error when adm-zip throws', function () {
    let getEntryStub = sinon.stub().returns({})
    let extractAllToStub = sinon.stub().throws()

    let fromZip = proxyquire('../../lib/install/fromZip', {
      'fs': {
        statSync () {
          return {isFile () { return true }}
        }
      },
      'tmp': {
        dirSync () {
          return {name: 'fake-temp-dir'}
        }
      },
      'adm-zip': function FakeAdmZip () {
        this.getEntry = getEntryStub
        this.extractAllTo = extractAllToStub
      }
    })

    let result = fromZip('fake-path-to-zip')
    result.should.be.an.instanceof(Error)

    getEntryStub.should.have.been.called
    extractAllToStub.should.have.been.calledOnce
  })

  it("returns an Error when 'fromFolder' returns an error", function () {
    let fromZip = proxyquire('../../lib/install/fromZip', {
      'fs': {
        statSync () {
          return {isFile () { return true }}
        }
      },
      'tmp': {
        dirSync () { return {name: 'fake-temp-dir'} }
      },
      'adm-zip': function FakeAdmZip (name) {
        name.should.equal('fake-path-to-zip')
        this.getEntry = () => ({})
        this.extractAllTo = () => true
      },
      './fromFolder' (packageDirectory, zipPath) {
        packageDirectory.should.equal('fake-temp-dir')
        zipPath.should.equal('fake-path-to-zip')
        return new Error()
      },
      '../cache': {
        add () {}
      }
    })

    let result = fromZip('fake-path-to-zip')
    result.should.be.an.instanceof(Error)
  })

  it('caches the package after installing', function () {
    let fakeManifest = {
      name: 'fake-mod',
      version: '1.2.3'
    }

    let fakeAddToCache = sinon.mock()
      .once()
      .withExactArgs('fake-path-to-zip', fakeManifest)

    let fromZip = proxyquire('../../lib/install/fromZip', {
      'fs': {
        statSync () {
          return {isFile () { return true }}
        }
      },
      'tmp': {
        dirSync () { return {name: 'fake-temp-dir'} }
      },
      'adm-zip': function FakeAdmZip (name) {
        name.should.equal('fake-path-to-zip')
        this.getEntry = () => ({})
        this.extractAllTo = () => true
      },
      './fromFolder' (packageDirectory, zipPath) {
        packageDirectory.should.equal('fake-temp-dir')
        zipPath.should.equal('fake-path-to-zip')
        return fakeManifest
      },
      '../cache': {
        add: fakeAddToCache
      }
    })

    fromZip('fake-path-to-zip')
    return fakeAddToCache.verify()
  })

  it("returns the result of calling 'fromFolder' on the unziped folder", function () {
    let fromZip = proxyquire('../../lib/install/fromZip', {
      'fs': {
        statSync () {
          return {isFile () { return true }}
        }
      },
      'tmp': {
        dirSync () { return {name: 'fake-temp-dir'} }
      },
      'adm-zip': function FakeAdmZip (name) {
        name.should.equal('fake-path-to-zip')
        this.getEntry = () => ({})
        this.extractAllTo = () => true
      },
      './fromFolder' (packageDirectory, zipPath) {
        packageDirectory.should.equal('fake-temp-dir')
        zipPath.should.equal('fake-path-to-zip')
        return 'fake-fromFolder-result'
      },
      '../cache': {
        add () {}
      }
    })

    let result = fromZip('fake-path-to-zip')
    result.should.equal('fake-fromFolder-result')
  })
})
