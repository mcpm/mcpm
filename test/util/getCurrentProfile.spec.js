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

loadFixture = ->
	JSON.parse fs.readFileSync pathToTheFixture, encoding: "utf-8"

getCurrentProfile = proxyquire "../../lib/util/getCurrentProfile",
	"./getMinecraftPath": -> pathToFixtures

describe "util.getCurrentProfile", ->

	afterEach ->
		# Roll back the changes to make the tests stateless.
		fixture = loadFixture()
		fixture.selectedProfile = "1.8 + Forge + LiteLoader"
		fixture.profiles[ "1.8 + Forge + LiteLoader" ].lastVersionId = "1.8.0"
		fs.writeFileSync pathToTheFixture, JSON.stringify fixture, null, 2

	it "returns current profile in originalInfo property", ( done ) ->
		fixture = loadFixture()
		actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]

		getCurrentProfile ( err, currentProfile ) ->
			expect( err ).to.equal undefined
			actualInfo.should.deep.equal currentProfile.originalInfo
			done()

	it "returns current Minecraft version in version property", ( done ) ->
		getCurrentProfile ( err, currentProfile ) ->
			expect( err ).to.equal undefined
			"1.8.0".should.equal currentProfile.version
			done()

	it "normalizes version to 'x.x.0' when specified as 'x.x'", ( done ) ->
		fixture = loadFixture()
		fixture.profiles[ "1.8 + Forge + LiteLoader" ].lastVersionId = "1.8"
		fs.writeFileSync pathToTheFixture, JSON.stringify fixture
		getCurrentProfile ( err, currentProfile ) ->
			expect( err ).to.equal undefined
			"1.8.0".should.equal currentProfile.version
			done()

	it "returns installed packages in installedPackages property", ( done ) ->
		getCurrentProfile ( err, currentProfile ) ->
			expect( err ).to.equal undefined
			packageList =
				fake: "1.2.3"
				package: "2.3.4"
			packageList.should.deep.equal currentProfile.installedPackages
			done()

	it "reloads profiles on each call", ( done ) ->
		fixture = loadFixture()
		actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]

		getCurrentProfile ( err, currentProfile ) ->
			expect( err ).to.equal undefined
			actualInfo.should.deep.equal currentProfile.originalInfo

			fixture.selectedProfile = "1.8"
			fs.writeFileSync pathToTheFixture, JSON.stringify fixture
			actualInfo = fixture.profiles[ "1.8" ]

			getCurrentProfile ( err, currentProfile ) ->
				expect( err ).to.equal undefined
				actualInfo.should.deep.equal currentProfile.originalInfo
				done()
