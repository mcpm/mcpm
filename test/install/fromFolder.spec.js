/* eslint-env mocha */

let sinon = require('sinon')
let proxyquire = require('proxyquire')

describe('install.fromFolder', function () {
  it('reads and checks package config', function () {
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({})
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.be.an.instanceof(Error)
    result.message.should.contain('manifest')
  })

  it('returns an Error when install executable exits with error', function () {
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({}),
      './validateManifest': () => ({install_executable: 'file.jar'}),
      './invokeInstallExecutable' (file, dir) {
        file.should.equal('file.jar')
        dir.should.equal('test/fixtures/invalid-mod')
        return new Error('Something went wrong!')
      }
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.be.an.instanceof(Error)
  })

  it("doesn't call invokeInstallExecutable when no install_executable", function () {
    let fakeInvoke = sinon.spy()
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({}),
      '../util/addInstalledPackage': () => true,
      './copyFiles': () => true,
      './addInstalledPackage': () => true,
      './validateManifest': () => ({install_file_list: {}}),
      './invokeInstallExecutable': fakeInvoke
    })

    fromFolder('test/fixtures/invalid-mod')

    fakeInvoke.should.have.not.been.called
  })

  it('returns an Error when flattenFileList returns an error', function () {
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({}),
      './validateManifest' () { return {install_file_list: { foo: 'bar' }} },
      './flattenFileList' (list, dir) {
        list.should.deep.equal({foo: 'bar'})
        dir.should.equal('test/fixtures/invalid-mod')
        return new Error('Something went wrong!')
      }
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.be.an.instanceof(Error)
  })

  it('returns an Error when copyFiles returns an error', function () {
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': ({}),
      './validateManifest' () { return {install_file_list: { foo: 'bar' }} },
      './flattenFileList' (list, dir) {
        list.should.deep.equal({foo: 'bar'})
        dir.should.equal('test/fixtures/invalid-mod')
        return {'copyFiles/foo': 'full/bar'}
      },
      './copyFiles' (list, dir) {
        list.should.deep.equal({'copyFiles/foo': 'full/bar'})
        dir.should.equal('test/fixtures/invalid-mod')
        return new Error('Something went wrong!')
      }
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.be.an.instanceof(Error)
  })

  it("first copies files, then invokes installer when there're both", function () {
    let fakeInvoke
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({}),
      './validateManifest': () => ({
        install_executable: 'foo',
        install_file_list: {bar: 'qux'}
      }),
      './flattenFileList' () {},
      './invokeInstallExecutable': fakeInvoke = sinon.spy(function () {
        fakeInvoke.should.have.been.calledOnce
        return new Error('Something went wrong!')
      }),
      './copyFiles': () => {
        fakeInvoke.should.have.not.been.called
      }
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.be.an.instanceof(Error)
  })

  it('returns an Error when addInstalledPackage returns an error', function () {
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({}),
      '../util/addInstalledPackage': () => new Error('Something went wrong!'),
      './validateManifest': () => ({install_executable: 'file.jar'}),
      './invokeInstallExecutable': () => true
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.be.an.instanceof(Error)
  })

  it('passes correct name and version to addInstalledPackage', function () {
    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({}),
      '../util/addInstalledPackage': (name, ver) => {
        name.should.equal('fake-mod')
        ver.should.equal('1.2.3')
        return new Error('Something went wrong!')
      },
      './validateManifest': () => ({
        name: 'fake-mod',
        version: '1.2.3',
        install_executable: 'file.jar'
      }),
      './invokeInstallExecutable': () => true
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.be.an.instanceof(Error)
  })

  it('returns the package manifest when everything goes right', function () {
    let fakeManifest =
    {install_executable: 'file.jar'}

    let fromFolder = proxyquire('../../lib/install/fromFolder', {
      '../util/getCurrentProfile': () => ({}),
      '../util/addInstalledPackage': () => true,
      './validateManifest': () => fakeManifest,
      './invokeInstallExecutable': () => true
    })

    let result = fromFolder('test/fixtures/invalid-mod')
    result.should.equal(fakeManifest)
  })
})
