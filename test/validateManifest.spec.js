/* eslint-env mocha */

let proxyquire = require('proxyquire')

let validateManifest = proxyquire('../lib/validateManifest', {
  '../util/getCurrentProfile': () => ({version: '1.8.0'})
})

describe('install.validateManifest', function () {
  it('returns an Error when no name', function (done) {
    validateManifest({
      version: '0.1.0',
      mc: '1.8',
      install_command: 'index.js'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('name')
      done()
    })
  })

  it('returns an Error when no version', function (done) {
    validateManifest({
      name: 'fake',
      mc: '1.8',
      install_command: 'index.js'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('version')
      done()
    })
  })

  it('returns an Error when no mc', function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      install_command: 'index.js'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('mc')
      done()
    })
  })

  let names = [ '', undefined, '-', '1sdf', 'π', 'mcpm/mcpm' ]
  names.forEach(name => it(`returns an Error when invalid name: ${name}`, function (done) {
    validateManifest({
      name,
      version: '0.1.0',
      mc: '1.8',
      install_command: 'index.js'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('name')
      done()
    })
  }))

  let versions = [ '', undefined, '1', '1.2', '1.2.', '1-2-3' ]
  versions.forEach(version => it(`returns an Error when invalid version: ${version}`, function (done) {
    validateManifest({
      name: 'fake',
      version,
      mc: '1.8',
      install_command: 'index.js'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('version')
      done()
    })
  }))

  versions = [ '', undefined, true, '1.', '1.2.', '1-2-3', 'all' ]
  versions.forEach(mc => it(`returns an Error when invalid mc: ${mc}`, function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      mc,
      install_command: 'index.js'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('mc')
      done()
    })
  }))

  it('returns an Error when incompatible with current Minecraft version', function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      mc: '1.5',
      install_command: 'index.js'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('version')
      done()
    })
  })

  it('returns true when manifest is valid', function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
      install_command: 'index.js'
    }).then(result => {
      result.should.equal(true)
      done()
    })
  })

  it('allows install_file_list instead of install_command', function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
      install_file_list: { 'mods/fake-mod': 'index.js'
      }
    }).then(result => {
      result.should.equal(true)
      done()
    })
  })

  it('returns an Error when install_file_list is not an object', function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
      install_file_list: [ 'index.js' ]
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('install')
      done()
    })
  })

  it('returns an Error when no install_file_list/install_command', function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      mc: '1.8'
    }).catch(error => {
      error.should.be.an.instanceof(Error)
      error.message.should.contain('install')
      done()
    })
  })

  it('allows custom fields', function (done) {
    validateManifest({
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
      install_command: 'index.js',
      custom: 'whatever',
      field: 5
    }).then(result => {
      result.should.equal(true)
      done()
    })
  })
})
