proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"
fs = require "fs"

# cwd seems to be outside of test/
pathToFixtures = path.resolve "test/fixtures"
pathToTheFixture = path.join pathToFixtures, "launcher_profiles.json"
profileName = "1.8 + Forge + LiteLoader"
fakeNewProfile = whatever: 5

loadFixture = ->
	JSON.parse fs.readFileSync pathToTheFixture, encoding: "utf-8"

describe "util.setCurrentProfile", ->

	it "returns an Error when writeFile fails", ( done ) ->
		triedToWriteThis = {}
		setCurrentProfile = proxyquire "../../lib/util/setCurrentProfile",
			"./getMinecraftPath": ->
				pathToFixtures
			"fs":
				writeFile: ( filename, json, callback ) ->
					filename.should.equal pathToTheFixture
					triedToWriteThis = JSON.parse json
					callback "fake-result"

		setCurrentProfile fakeNewProfile, ( err ) ->
			expect( err ).to.equal "fake-result"
			done()

	it "blindly rewrites current profile with specified object", ( done ) ->
		triedToWriteThis = {}
		setCurrentProfile = proxyquire "../../lib/util/setCurrentProfile",
			"./getMinecraftPath": ->
				pathToFixtures
			"fs":
				writeFile: ( filename, json, callback ) ->
					filename.should.equal pathToTheFixture
					triedToWriteThis = JSON.parse json
					callback()

		setCurrentProfile fakeNewProfile, ( err ) ->
			expect( err ).to.equal undefined
			triedToWriteThis.profiles[ profileName ].should.deep.equal fakeNewProfile
			done()
