proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"
fakeChildProcess =
	spawnSync: sinon.spy ( file, args, opts ) ->
		file.should.equal path.join "fixtures/fake-mod", "fake.jar"
		opts.cwd.should.equal "fixtures/fake-mod"
		opts.env.should.deep.equal
			MCPM: "1"
			PATH_TO_MINECRAFT: "mcpath"

invokeInstallExecutable = proxyquire "../../lib/install/invokeInstallExecutable",
	"../minecraftUtils": getMinecraftPath: -> "mcpath"
	child_process: fakeChildProcess

describe "install.invokeInstallExecutable", ->

	beforeEach ->
		fakeChildProcess.spawnSync.reset()

	it "returns an Error when trying to call a file outside of package", ->
		result = invokeInstallExecutable "foo/../../bar.jar", "malicious"
		result.should.be.an.instanceof Error
		fakeChildProcess.spawnSync.should.have.not.been.called

	it "invokes install executable", ->
		invokeInstallExecutable "fake.jar", "fixtures/fake-mod"
		fakeChildProcess.spawnSync.should.have.been.calledOnce

	it "returns an Error when install executable exists with error", ->
		fakeChildProcess.spawnSync = ( file, args, opts ) ->
			throw new Error "Something went wrong!"
		result = invokeInstallExecutable "fake.jar", "fake-mod"
		result.should.be.an.instanceof Error
