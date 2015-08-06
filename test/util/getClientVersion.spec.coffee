proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

getClientVersion = proxyquire "../../lib/util/getClientVersion",
	"./getCurrentProfile": ->
		version: "fake-version"

describe "util.getClientVersion", ->

		it "returns 'getCurrentProfile().version'", ->
			result = getClientVersion()
			"fake-version".should.equal result
