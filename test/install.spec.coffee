chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

install = require "../lib/install.js"

describe "install", ->

	describe "readConfig", ->

		path = require "path"

		it "reads config inside package and returns its contents", ->
			result = install.readConfig path.resolve "./test/fixtures/fake-mod"
			result.should.be.a "string"

		it "returns null when config not found", ->
			result = install.readConfig path.resolve "./test/fixtures/404"
			expect( result ).to.equal null

	describe "checkConfig", ->

		beforeEach -> sinon.stub install, "readConfig", ( str ) -> str
		afterEach -> install.readConfig.restore()

		it "returns a SyntaxError when invalid JSON", ->
			result = install.checkConfig "{'nope'}"
			result.should.be.an.instanceof SyntaxError

		it "returns an Error when no name", ->
			result = install.checkConfig JSON.stringify
				version: "0.1.0"
				mc: "1.8"
			result.should.be.an.instanceof Error
			result.message.should.contain "name"

		it "returns an Error when no version", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				mc: "1.8"
			result.should.be.an.instanceof Error
			result.message.should.contain "version"

		it "returns an Error when no mc", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				version: "0.1.0"
			result.should.be.an.instanceof Error
			result.message.should.contain "mc"

		for name in [ "", undefined, "-", "1sdf", "π", "mcpm/mcpm" ]
			do ( name ) ->
				it "returns an Error when invalid name: " + name, ->
					result = install.checkConfig JSON.stringify
						name: name
						version: "0.1.0"
						mc: "1.8"
					result.should.be.an.instanceof Error
					result.message.should.contain "name"

		for version in [ "", undefined, "1", "1.2", "1.2.", "1-2-3" ]
			do (version) ->
				it "returns an Error when invalid version: " + version, ->
					result = install.checkConfig JSON.stringify
						name: "fake"
						version: version
						mc: "1.8"
					result.should.be.an.instanceof Error
					result.message.should.contain "version"

		for mc in [ "", undefined, true, "1.", "1.2.", "1-2-3", "all" ]
			do ( mc ) ->
				it "returns an Error when invalid mc: " + mc, ->
					result = install.checkConfig JSON.stringify
						name: "fake"
						version: "0.1.0"
						mc: mc
					result.should.be.an.instanceof Error
					result.message.should.contain "mc"

		it "returns true when config is valid", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				version: "0.1.0"
				mc: "1.8"
			result.should.equal true

		it "allows custom fields", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				version: "0.1.0"
				mc: "1.8"
				custom: "whatever"
				field: 5
			result.should.equal true
