proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"

describe "util.getPathToMcpmDir", ->

	it "returns '%APPDATA%/.mcpm'", ->
		getPathToMcpmDir = proxyquire "../../lib/util/getPathToMcpmDir",
			"user-settings-dir": -> "fake-dir"

		result = getPathToMcpmDir()

		result.should.equal path.join "fake-dir", ".mcpm"
