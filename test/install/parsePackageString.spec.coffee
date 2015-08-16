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
			it "classifies any '.zip'-suffixed string as 'zip': #{str}.zip", ->
				parsed = parsePackageString "#{str}.zip"
				parsed.should.include
					type: "zip"
					name: "#{str}.zip"

	for str in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
		do ( str ) ->
			it "classifies any other non-prefixed string as 'folder': #{str}", ->
				parsed = parsePackageString str
				parsed.should.include
					type: "folder"
					name: str

	for str in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
		do ( str ) ->
			it "classifies 'folder'-prefixed string as 'folder': #{str}", ->
				parsed = parsePackageString "folder:#{str}"
				parsed.should.include
					type: "folder"
					name: str

	for str in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
		do ( str ) ->
			it "classifies 'zip'-prefixed string as 'zip': #{str}", ->
				parsed = parsePackageString "zip:#{str}"
				parsed.should.include
					type: "zip"
					name: str

	for str in [ "a@b", "@", "-@-", "../..@0.0.0", "mcpm@1.0.0" ]
		do ( str ) ->
			it "classifies strings with '@' as 'cache': #{str}", ->
				parsed = parsePackageString str
				parsed.should.include
					type: "cache"
					name: str.split( "@" )[ 0 ]
					version: str.split( "@" )[ 1 ]

	for prefix in [ "github", "http", "", "whatever", "C" ]
		do ( prefix ) ->
			it "treats any other prefix as a part of path: #{prefix}", ->
				parsed = parsePackageString "#{prefix}:some/path"
				parsed.should.include
					type: "folder"
					name: "#{prefix}:some/path"

	it "classifies strings with multiple ':' as 'invalid'", ->
		parsed = parsePackageString "folder:wtf:is:this"
		expect( parsed ).to.equal null
