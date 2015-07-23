chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

readConfig = require "../../lib/install/readConfig"

path = require "path"

describe "install.readConfig", ->

	it "reads config inside package and returns its contents", ->
		result = readConfig path.resolve "./test/fixtures/fake-mod"
		result.should.be.a "string"

	it "returns null when config not found", ->
		result = readConfig path.resolve "./test/fixtures/404"
		expect( result ).to.equal null
