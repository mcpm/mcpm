proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"

describe "cache.get", ->
	it "returns an Error when package name isn't specified", ( done ) ->
		fakeExists = sinon.stub().throws()

		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				exists: fakeExists

		get undefined, undefined, ( err, result ) ->
			err.should.be.an.instanceof Error
			done()

	for name in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
		do ( name ) ->
			it "returns an Error when package name isn't valid: " + name, ( done ) ->
				fakeExists = sinon.stub().throws()

				get = proxyquire "../../lib/cache/get",
					"../util":
						getPathToMcpmDir: -> "fake-.mcpm"
					"fs-extra":
						exists: fakeExists

				get name, "1.0.0", ( err, result ) ->
					err.should.be.an.instanceof Error
					done()

	it "returns an Error when specified version isn't semantic", ( done ) ->
		fakeExists = sinon.stub().throws()

		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				exists: fakeExists
			"semver":
				valid: -> false

		get "whatever", "this is not a valid version", ( err, result ) ->
			err.should.be.an.instanceof Error
			done()

	it "when the version is semantic, return an Error if it's not cached", ( done ) ->
		pathToZip = path.join "fake-.mcpm", "cache", "whatever", "1.0.0", "mcpm-package.zip"
		fakeExists = sinon.mock()
			.once()
			.withArgs pathToZip, sinon.match.func
			.callsArgWithAsync 1, no

		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				exists: fakeExists

		get "whatever", "1.0.0", ( err, result ) ->
			err.should.be.an.instanceof Error
			fakeExists.verify()
			done()

	it "when the version is semantic, return path to zip if it exists", ( done ) ->
		pathToZip = path.join "fake-.mcpm", "cache", "whatever", "1.0.0", "mcpm-package.zip"
		fakeExists = sinon.mock()
			.once()
			.withArgs pathToZip, sinon.match.func
			.callsArgWithAsync 1, yes

		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				exists: fakeExists

		get "whatever", "1.0.0", ( err, result ) ->
			expect( err ).to.equal null
			result.should.equal pathToZip
			fakeExists.verify()
			done()
