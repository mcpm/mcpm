proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

getClientVersion = proxyquire "../../lib/util/getClientVersion",
	"./getCurrentProfile": ( callback ) ->
		callback version: "fake-version"

describe "util.getClientVersion", ->

		it "returns 'getCurrentProfile().version'", ( done ) ->
			getClientVersion ( result ) ->
				"fake-version".should.equal result
				done()
