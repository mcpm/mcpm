/* eslint-env mocha */

let sinon = require('sinon')
let proxyquire = require('proxyquire')

let fakeChildProcess = {
  execFileSync: sinon.spy(function (file, args, opts) {
    file.should.equal('fake.jar')
    opts.cwd.should.equal('fixtures/fake-mod')
    opts.env.should.deep.equal({
      MCPM: '1',
      PATH_TO_MINECRAFT: 'mcpath'
    })
  })
}

let invokeInstallExecutable = proxyquire('../../lib/install/invokeInstallExecutable', {
  '../util/getMinecraftPath': () => 'mcpath',
  child_process: fakeChildProcess
})

describe('install.invokeInstallExecutable', function () {
  beforeEach(() => fakeChildProcess.execFileSync.reset())

  it('returns an Error when trying to call a file outside of package', function () {
    let result = invokeInstallExecutable('foo/../../bar.jar', 'malicious')
    result.should.be.an.instanceof(Error)
    fakeChildProcess.execFileSync.should.have.not.been.called
  })

  it('invokes install executable', function () {
    invokeInstallExecutable('fake.jar', 'fixtures/fake-mod')
    fakeChildProcess.execFileSync.should.have.been.calledOnce
  })

  it("returns an Error when 'execFileSync' throws", function () {
    fakeChildProcess.execFileSync = sinon.spy(function (file, args, opts) {
      throw new Error('Something went wrong!')
    })
    let result = invokeInstallExecutable('fake.jar', 'fake-mod')
    result.should.be.an.instanceof(Error)
  })
})
