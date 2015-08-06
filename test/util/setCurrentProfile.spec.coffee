proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
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

triedToWriteThis = {}

setCurrentProfile = proxyquire "../../lib/util/setCurrentProfile",
	"./getMinecraftPath": -> pathToFixtures
	"fs":
		writeFileSync: ( filename, json ) ->
			filename.should.equal pathToTheFixture
			triedToWriteThis = JSON.parse json

describe "util.setCurrentProfile", ->

	it "blindly rewrites current profile with specified object", ->
		setCurrentProfile fakeNewProfile
		triedToWriteThis.profiles[ profileName ].should.deep.equal fakeNewProfile
