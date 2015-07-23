chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

parsePackageString = require "../../lib/install/parsePackageString"

describe "install.parsePackageString", ->

	for obj in [ null, undefined, 100, {}, [ "folder:some/path" ] ]
		do ( obj ) ->
			it "classifies non-strings as 'invalid': #{obj}", ->
				parsed = parsePackageString obj
				expect( parsed ).to.equal null

	for str in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
		do ( str ) ->
			it "classifies any non-prefixed string as 'folder': #{str}", ->
				parsed = parsePackageString str
				parsed.should.deep.equal
					type: "folder"
					name: str

	for str in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
		do ( str ) ->
			it "classifies 'folder'-prefixed string as 'folder': #{str}", ->
				parsed = parsePackageString "folder:#{str}"
				parsed.should.deep.equal
					type: "folder"
					name: str

	for prefix in [ "github", "http", "", "whatever", ":folder" ]
		do ( prefix ) ->
			it "classifies any other prefix as 'invalid': #{prefix}", ->
				parsed = parsePackageString "#{prefix}:some/path"
				expect( parsed ).to.equal null

	it "classifies strings with multiple ':' as 'invalid'", ->
		parsed = parsePackageString "folder:wtf:is:this"
		expect( parsed ).to.equal null
