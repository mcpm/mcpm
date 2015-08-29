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
			.once()
			.withArgs "path/to/src.zip", path.join( dest, "mcpm-package.zip" ), sinon.match.func
			.callsArgAsync 2

		fakeOutputJson = sinon.stub()
			.callsArgAsync 2

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

	it "returns an Error when fs.copy fails", ( done ) ->
		dest = path.join "fake-.mcpm", "cache", "fake-package", "1.2.3"
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"

		fakeCopy = sinon.mock()
			.once()
			.callsArgWithAsync 2, new Error "Oh, snap!"

		fakeOutputJson = sinon.stub()
			.throws()

		add = proxyquire "../../lib/cache/add",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				copy: fakeCopy
				outputJson: fakeOutputJson

		add "path/to/src.zip", fakeManifest, ( err ) ->
			err.should.be.an.instanceof Error
			fakeCopy.verify()
			done()

	it "adds the package manifest to cache", ( done ) ->
		dest = path.join "fake-.mcpm", "cache", "fake-package", "1.2.3"
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"

		fakeCopy = sinon.stub()
			.callsArgAsync 2

		fakeOutputJson = sinon.mock()
			.once()
			.withArgs path.join( dest, "mcpm-package.json" ), fakeManifest
			.callsArgAsync 2

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

	it "returns an Error when fs.outputJson fails", ( done ) ->
		dest = path.join "fake-.mcpm", "cache", "fake-package", "1.2.3"
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"

		fakeCopy = sinon.stub()
			.callsArgAsync 2

		fakeOutputJson = sinon.mock()
			.once()
			.withArgs path.join( dest, "mcpm-package.json" ), fakeManifest
			.callsArgWithAsync 2, new Error "Oh, snap!"

		add = proxyquire "../../lib/cache/add",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				copy: fakeCopy
				outputJson: fakeOutputJson

		add "path/to/src.zip", fakeManifest, ( err ) ->
			err.should.be.an.instanceof Error
			fakeOutputJson.verify()
			done()
