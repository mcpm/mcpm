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
	fakeExistsSync = sinon.stub()

	it "returns null when package name isn't specified", ->
		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				existsSync: fakeExistsSync

		result = get()

		expect( result ).to.equal null
		fakeExistsSync.should.not.have.been.called

	it "returns null when specified version isn't semantic", ->
		fakeExistsSync = sinon.stub()

		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				existsSync: fakeExistsSync
			"semver":
				valid: -> false

		result = get "whatever", "this is not a valid version"

		expect( result ).to.equal null
		fakeExistsSync.should.not.have.been.called

	it "when the version is semantic, return null if it's not cached", ->
		fakeExistsSync = sinon.spy ( filename ) ->
			filename.should.equal path.join "fake-.mcpm", "whatever", "1.0.0", "mcpm-package.zip"
			no

		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				existsSync: fakeExistsSync

		result = get "whatever", "1.0.0"

		expect( result ).to.equal null
		fakeExistsSync.should.have.been.calledOnce

	it "when the version is semantic, return path to zip if it exists", ->
		pathToZip = path.join "fake-.mcpm", "whatever", "1.0.0", "mcpm-package.zip"
		fakeExistsSync = sinon.spy ( filename ) ->
			filename.should.equal pathToZip
			yes

		get = proxyquire "../../lib/cache/get",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				existsSync: fakeExistsSync

		result = get "whatever", "1.0.0"

		result.should.equal pathToZip
		fakeExistsSync.should.have.been.calledOnce
