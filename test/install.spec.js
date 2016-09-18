/* eslint-env mocha */

let sinon = require('sinon')
let proxyquire = require('proxyquire')

describe('install', function () {
  it('returns an Error when parsePackageString returns null', function () {
    let fakeParsePackageString = sinon.stub().returns(null)

    let install = proxyquire('../lib/install',
      {'./install/parsePackageString': fakeParsePackageString})

    let result = install('whatever')

    result.should.be.instanceof(Error)
  })

  it("calls install.fromFolder when package is of 'folder' type", function () {
    let fakeParsePackageString = sinon.stub().returns({
      type: 'folder',
      name: 'whatever'
    })

    let fakeFromFolder = sinon.mock().once().withExactArgs('whatever')

    let install = proxyquire('../lib/install', {
      './install/parsePackageString': fakeParsePackageString,
      './install/fromFolder': fakeFromFolder
    })

    install('whatever')

    fakeFromFolder.verify()
  })

  it("calls install.fromZip when package is of 'zip' type", function () {
    let fakeParsePackageString = sinon.stub().returns({
      type: 'zip',
      name: 'whatever'
    })

    let fakeFromZip = sinon.mock().once().withExactArgs('whatever')

    let install = proxyquire('../lib/install', {
      './install/parsePackageString': fakeParsePackageString,
      './install/fromZip': fakeFromZip
    })

    install('whatever')

    fakeFromZip.verify()
  })

  it("calls install.fromCache when package is of 'cache' type", function () {
    let fakeParsePackageString = sinon.stub().returns({
      type: 'cache',
      name: 'whatever',
      version: 'fake-version'
    })

    let fakeFromCache = sinon.mock().once().withExactArgs('whatever', 'fake-version')

    let install = proxyquire('../lib/install', {
      './install/parsePackageString': fakeParsePackageString,
      './install/fromCache': fakeFromCache
    })

    install('whatever')

    fakeFromCache.verify()
  })
})
