let proxyquire = require('proxyquire')
let chai = require('chai')
let sinon = require('sinon')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let path = require('path')
let fakeChildProcess = {
  execFileSync: sinon.spy(function (file, args, opts) {
    file.should.equal('fake.jar')
    opts.cwd.should.equal('fixtures/fake-mod')
    return opts.env.should.deep.equal({
      MCPM: '1',
      PATH_TO_MINECRAFT: 'mcpath'
    })
  })
}

let invokeInstallExecutable = proxyquire('../../lib/install/invokeInstallExecutable', {
  '../util': { getMinecraftPath() { return 'mcpath'; }
  },
  child_process: fakeChildProcess
}
)

describe('install.invokeInstallExecutable', function () {
  beforeEach(() => fakeChildProcess.execFileSync.reset())

  it('returns an Error when trying to call a file outside of package', function () {
    let result = invokeInstallExecutable('foo/../../bar.jar', 'malicious')
    result.should.be.an.instanceof(Error)
    return fakeChildProcess.execFileSync.should.have.not.been.called
  }
  )

  it('invokes install executable', function () {
    invokeInstallExecutable('fake.jar', 'fixtures/fake-mod')
    return fakeChildProcess.execFileSync.should.have.been.calledOnce
  }
  )

  return it("returns an Error when 'execFileSync' throws", function () {
    fakeChildProcess.execFileSync = sinon.spy(function (file, args, opts) {
      throw new Error('Something went wrong!')
    })
    let result = invokeInstallExecutable('fake.jar', 'fake-mod')
    return result.should.be.an.instanceof(Error)
  }
  )
}
)
