proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

checkConfig = proxyquire "../../lib/install/checkConfig",
	"./readConfig": ( str ) -> str

describe "install.checkConfig", ->

	it "returns a SyntaxError when invalid JSON", ->
		result = checkConfig "{'nope'}"
		result.should.be.an.instanceof SyntaxError

	it "returns an Error when no name", ->
		result = checkConfig JSON.stringify
			version: "0.1.0"
			mc: "1.8"
			install_executable: "index.js"
		result.should.be.an.instanceof Error
		result.message.should.contain "name"

	it "returns an Error when no version", ->
		result = checkConfig JSON.stringify
			name: "fake"
			mc: "1.8"
			install_executable: "index.js"
		result.should.be.an.instanceof Error
		result.message.should.contain "version"

	it "returns an Error when no mc", ->
		result = checkConfig JSON.stringify
			name: "fake"
			version: "0.1.0"
			install_executable: "index.js"
		result.should.be.an.instanceof Error
		result.message.should.contain "mc"

	for name in [ "", undefined, "-", "1sdf", "π", "mcpm/mcpm" ]
		do ( name ) ->
			it "returns an Error when invalid name: " + name, ->
				result = checkConfig JSON.stringify
					name: name
					version: "0.1.0"
					mc: "1.8"
					install_executable: "index.js"
				result.should.be.an.instanceof Error
				result.message.should.contain "name"

	for version in [ "", undefined, "1", "1.2", "1.2.", "1-2-3" ]
		do (version) ->
			it "returns an Error when invalid version: " + version, ->
				result = checkConfig JSON.stringify
					name: "fake"
					version: version
					mc: "1.8"
					install_executable: "index.js"
				result.should.be.an.instanceof Error
				result.message.should.contain "version"

	for mc in [ "", undefined, true, "1.", "1.2.", "1-2-3", "all" ]
		do ( mc ) ->
			it "returns an Error when invalid mc: " + mc, ->
				result = checkConfig JSON.stringify
					name: "fake"
					version: "0.1.0"
					mc: mc
					install_executable: "index.js"
				result.should.be.an.instanceof Error
				result.message.should.contain "mc"

	it "returns the config when it is valid", ->
		config =
			name: "fake"
			version: "0.1.0"
			mc: "1.8"
			install_executable: "index.js"
		result = checkConfig JSON.stringify config
		result.should.deep.equal config

	it "allows install_file_list instead of install_executable", ->
		config =
			name: "fake"
			version: "0.1.0"
			mc: "1.8"
			install_file_list: "mods/fake-mod": "index.js"
		result = checkConfig JSON.stringify config
		result.should.deep.equal config

	it "returns an Error when install_file_list is not an object", ->
		result = checkConfig JSON.stringify
			name: "fake"
			version: "0.1.0"
			mc: "1.8"
			install_file_list: [ "index.js" ]
		result.should.be.an.instanceof Error
		result.message.should.contain "install"

	it "returns an Error when no install_file_list/install_executable", ->
		result = checkConfig JSON.stringify
			name: "fake"
			version: "0.1.0"
			mc: "1.8"
		result.should.be.an.instanceof Error
		result.message.should.contain "install"

	it "allows custom fields", ->
		config =
			name: "fake"
			version: "0.1.0"
			mc: "1.8"
			install_executable: "index.js"
			custom: "whatever"
			field: 5
		result = checkConfig JSON.stringify config
		result.should.deep.equal config
