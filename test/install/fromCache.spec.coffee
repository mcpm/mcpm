proxyquire = require( "proxyquire" ).noPreserveCache()
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

describe "install.fromCache", ->

	it "returns an Error when 'cache.get' returns null", ->
		fakeFromZip = sinon.stub()
		fakeCacheGet = sinon.stub().returns null

		fromCache = proxyquire "../../lib/install/fromCache",
			"./fromZip": fakeFromZip
			"../cache":
				get: fakeCacheGet

		result = fromCache "name", "version"
		result.should.be.an.instanceof Error

		fakeCacheGet.should.have.been.calledOnce
		fakeFromZip.should.not.have.been.called

	it "delegates installation to 'fromZip', returns its result", ->
		fakeFromZip = sinon.stub().returns "fake-result"
		fakeCacheGet = sinon.stub().returns "path/to/fake.zip"

		fromCache = proxyquire "../../lib/install/fromCache",
			"./fromZip": fakeFromZip
			"../cache":
				get: fakeCacheGet

		result = fromCache "name", "version"
		result.should.equal "fake-result"

		fakeCacheGet.should.have.been.calledOnce
		fakeFromZip.should.have.been.calledOnce
