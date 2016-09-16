let proxyquire = require('proxyquire')
let chai = require('chai')
let sinon = require('sinon')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let validateManifest = proxyquire('../../lib/install/validateManifest', {
  ['./readManifest'](str) { return str; },
  '../util': {
    getCurrentProfile() {
      return {version: '1.8.0'}
    }
  }
}
)

describe('install.validateManifest', function () {
  it('returns a SyntaxError when invalid JSON', function () {
    let result = validateManifest("{'nope'}")
    return result.should.be.an.instanceof(SyntaxError)
  }
  )

  it('returns an Error when no name', function () {
    let result = validateManifest(JSON.stringify({
      version: '0.1.0',
      mc: '1.8',
      install_executable: 'index.js'
    })
    )
    result.should.be.an.instanceof(Error)
    return result.message.should.contain('name')
  }
  )

  it('returns an Error when no version', function () {
    let result = validateManifest(JSON.stringify({
      name: 'fake',
      mc: '1.8',
      install_executable: 'index.js'
    })
    )
    result.should.be.an.instanceof(Error)
    return result.message.should.contain('version')
  }
  )

  it('returns an Error when no mc', function () {
    let result = validateManifest(JSON.stringify({
      name: 'fake',
      version: '0.1.0',
      install_executable: 'index.js'
    })
    )
    result.should.be.an.instanceof(Error)
    return result.message.should.contain('mc')
  }
  )

  let iterable = [ '', undefined, '-', '1sdf', 'π', 'mcpm/mcpm' ]
  for (let i = 0; i < iterable.length; i++) {
    let name = iterable[i](name => it(`returns an Error when invalid name: ${name}`, function () {
      let result = validateManifest(JSON.stringify({
        name,
        version: '0.1.0',
        mc: '1.8',
        install_executable: 'index.js'
      })
      )
      result.should.be.an.instanceof(Error)
      return result.message.should.contain('name')
    }
    )
    )(name)
  }

  let iterable1 = [ '', undefined, '1', '1.2', '1.2.', '1-2-3' ]
  for (let j = 0; j < iterable1.length; j++) {
    let version = iterable1[j](version => it(`returns an Error when invalid version: ${version}`, function () {
      let result = validateManifest(JSON.stringify({
        name: 'fake',
        version,
        mc: '1.8',
        install_executable: 'index.js'
      })
      )
      result.should.be.an.instanceof(Error)
      return result.message.should.contain('version')
    }
    )
    )(version)
  }

  let iterable2 = [ '', undefined, true, '1.', '1.2.', '1-2-3', 'all' ]
  for (let k = 0; k < iterable2.length; k++) {
    let mc = iterable2[k](mc => it(`returns an Error when invalid mc: ${mc}`, function () {
      let result = validateManifest(JSON.stringify({
        name: 'fake',
        version: '0.1.0',
        mc,
        install_executable: 'index.js'
      })
      )
      result.should.be.an.instanceof(Error)
      return result.message.should.contain('mc')
    }
    )
    )(mc)
  }

  it('returns an Error when incompatible with current Minecraft version', function () {
    let result = validateManifest(JSON.stringify({
      name: 'fake',
      version: '0.1.0',
      mc: '1.5',
      install_executable: 'index.js'
    })
    )
    result.should.be.an.instanceof(Error)
    return result.message.should.contain('version')
  }
  )

  it('returns the config when it is valid', function () {
    let config = {
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
      install_executable: 'index.js'
    }
    let result = validateManifest(JSON.stringify(config))
    return result.should.deep.equal(config)
  }
  )

  it('allows install_file_list instead of install_executable', function () {
    let config = {
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
      install_file_list: { 'mods/fake-mod': 'index.js'
      }
    }
    let result = validateManifest(JSON.stringify(config))
    return result.should.deep.equal(config)
  }
  )

  it('returns an Error when install_file_list is not an object', function () {
    let result = validateManifest(JSON.stringify({
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
    install_file_list: [ 'index.js' ]}))
    result.should.be.an.instanceof(Error)
    return result.message.should.contain('install')
  }
  )

  it('returns an Error when no install_file_list/install_executable', function () {
    let result = validateManifest(JSON.stringify({
      name: 'fake',
      version: '0.1.0',
      mc: '1.8'
    })
    )
    result.should.be.an.instanceof(Error)
    return result.message.should.contain('install')
  }
  )

  return it('allows custom fields', function () {
    let config = {
      name: 'fake',
      version: '0.1.0',
      mc: '1.8',
      install_executable: 'index.js',
      custom: 'whatever',
      field: 5
    }
    let result = validateManifest(JSON.stringify(config))
    return result.should.deep.equal(config)
  }
  )
}
)
