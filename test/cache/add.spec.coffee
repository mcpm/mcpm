proxyquire = require "proxyquire"
chai = require "chai"
expect = chai.expect
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"

describe "cache.add", ->

	it "doesn't do anything when trying to cache the cached zip itself", ( done ) ->
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"
		dest = path.join "fake-.mcpm", "cache", fakeManifest.name, fakeManifest.version
		pathToZip = path.join dest, "mcpm-package.zip"

		fakeCopy = sinon.stub()
		fakeOutputJson = sinon.stub()

		add = proxyquire "../../lib/cache/add",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				copy: fakeCopy
				outputJson: fakeOutputJson

		add pathToZip, fakeManifest, ( err ) ->
			expect( err ).to.equal null
			done()

		fakeCopy.should.not.have.been.called
		fakeOutputJson.should.not.have.been.called

	it "adds specified zip to cache", ( done ) ->
		dest = path.join "fake-.mcpm", "cache", "fake-package", "1.2.3"
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"

		fakeCopy = sinon.mock()
			.withArgs "path/to/src.zip", path.join( dest, "mcpm-package.zip" ), sinon.match.func
			.callsArg 2

		fakeOutputJson = sinon.stub()
			.callsArg 2

		add = proxyquire "../../lib/cache/add",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				copy: fakeCopy
				outputJson: fakeOutputJson

		add "path/to/src.zip", fakeManifest, ( err ) ->
			expect( err ).to.equal null
			fakeCopy.verify()
			done()

	it "adds the package manifest to cache", ( done ) ->
		dest = path.join "fake-.mcpm", "cache", "fake-package", "1.2.3"
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"

		fakeCopy = sinon.stub()
			.callsArg 2

		fakeOutputJson = sinon.mock()
			.withArgs path.join( dest, "mcpm-package.json" ), fakeManifest
			.callsArg 2

		add = proxyquire "../../lib/cache/add",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				copy: fakeCopy
				outputJson: fakeOutputJson

		add "path/to/src.zip", fakeManifest, ( err ) ->
			expect( err ).to.equal null
			fakeOutputJson.verify()
			done()

