chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

minecraftUtils = require "../lib/minecraftUtils.js"

os = require "os"
path = require "path"
fs = require "fs"

describe "minecraftUtils", ->

	describe "getMinecraftPath", ->

		it "returns path to the Minecraft directory", ->
			originalHome = process.env.HOME
			process.env.HOME = "fakeHome"

			fakeOsPlatform = null
			sinon.stub os, "platform", -> fakeOsPlatform

			fakeOsPlatform = "win32"
			minecraftUtils.getMinecraftPath().should.equal path.join "fakeHome",
				"AppData", "Roaming", ".minecraft"

			fakeOsPlatform = "linux"
			minecraftUtils.getMinecraftPath().should.equal path.join "fakeHome",
				".minecraft"

			fakeOsPlatform = "darwin"
			minecraftUtils.getMinecraftPath().should.equal path.join "fakeHome",
				"Library", "Application Support", "minecraft"

			process.env.HOME = originalHome
			os.platform.restore()

	describe "getCurrentProfile", ->

		# cwd seems to be outside of test/
		pathToFixtures = path.resolve "test/fixtures"
		pathToTheFixture = path.join pathToFixtures, "launcher_profiles.json"

		loadFixture = ->
			JSON.parse fs.readFileSync pathToTheFixture, encoding: "utf-8"

		before ->
			sinon.stub minecraftUtils, "getMinecraftPath", -> pathToFixtures

		after ->
			minecraftUtils.getMinecraftPath.restore()

		afterEach ->
			# Roll back the changes to make the tests stateless.
			fixture = loadFixture()
			fixture.selectedProfile = "1.8 + Forge + LiteLoader"
			fixture.profiles[ "1.8 + Forge + LiteLoader" ].lastVersionId = "1.8.0"
			fs.writeFileSync pathToTheFixture, JSON.stringify fixture, null, 2

		it "returns current profile in originalInfo property", ->
			fixture = loadFixture()
			actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]

			currentProfile = minecraftUtils.getCurrentProfile()
			actualInfo.should.deep.equal currentProfile.originalInfo

		it "returns current Minecraft version in version property", ->
			currentProfile = minecraftUtils.getCurrentProfile()
			"1.8.0".should.equal currentProfile.version

		it "normalizes version to 'x.x.0' when specified as 'x.x'", ->
			fixture = loadFixture()
			fixture.profiles[ "1.8 + Forge + LiteLoader" ].lastVersionId = "1.8"
			fs.writeFileSync pathToTheFixture, JSON.stringify fixture
			currentProfile = minecraftUtils.getCurrentProfile()
			"1.8.0".should.equal currentProfile.version

		it "returns installed packages in installedPackages property", ->
			currentProfile = minecraftUtils.getCurrentProfile()
			packageList =
				fake: "1.2.3"
				package: "2.3.4"
			packageList.should.deep.equal currentProfile.installedPackages

		it "reloads profiles on each call", ->
			fixture = loadFixture()
			actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]

			currentProfile = minecraftUtils.getCurrentProfile()
			actualInfo.should.deep.equal currentProfile.originalInfo

			fixture.selectedProfile = "1.8"
			fs.writeFileSync pathToTheFixture, JSON.stringify fixture
			actualInfo = fixture.profiles[ "1.8" ]

			currentProfile = minecraftUtils.getCurrentProfile()
			actualInfo.should.deep.equal currentProfile.originalInfo

	describe "setCurrentProfile", ->

		# cwd seems to be outside of test/
		pathToFixtures = path.resolve "test/fixtures"
		pathToTheFixture = path.join pathToFixtures, "launcher_profiles.json"
		profileName = "1.8 + Forge + LiteLoader"
		fakeNewProfile = whatever: 5

		loadFixture = ->
			JSON.parse fs.readFileSync pathToTheFixture, encoding: "utf-8"

		triedToWriteThis = {}
		before ->
			sinon.stub minecraftUtils, "getMinecraftPath", -> pathToFixtures
			sinon.stub fs, "writeFileSync", ( filename, json ) ->
				filename.should.equal pathToTheFixture
				triedToWriteThis = JSON.parse json

		after ->
			minecraftUtils.getMinecraftPath.restore()
			fs.writeFileSync.restore()

		it "blindly rewrites current profile with specified object", ->
			minecraftUtils.setCurrentProfile fakeNewProfile
			triedToWriteThis.profiles[ profileName ].should.deep.equal fakeNewProfile

	describe "addInstalledPackage", ->

		# cwd seems to be outside of test/
		pathToFixtures = path.resolve "test/fixtures"
		pathToTheFixture = path.join pathToFixtures, "launcher_profiles.json"
		profileName = "1.8 + Forge + LiteLoader"

		loadFixture = ->
			JSON.parse fs.readFileSync pathToTheFixture, encoding: "utf-8"

		before ->
			sinon.stub minecraftUtils, "getMinecraftPath", -> pathToFixtures

		after ->
			minecraftUtils.getMinecraftPath.restore()

		afterEach ->
			# Roll back the changes to make the tests stateless.
			fixture = loadFixture()
			fixture.selectedProfile = "1.8 + Forge + LiteLoader"
			actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]
			actualInfo.mcpmInstalledPackages =
				fake: "1.2.3"
				package: "2.3.4"
			fs.writeFileSync pathToTheFixture, JSON.stringify fixture, null, 2

		it "should add specified module to 'mcpmInstalledPackages'", ->
			minecraftUtils.addInstalledPackage "fake-package", "0.1.0"
			profile = minecraftUtils.getCurrentProfile()
			installedPackages = profile.installedPackages
			"0.1.0".should.equal installedPackages[ "fake-package" ]

			fixture = loadFixture()
			actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]
			installedPackages = actualInfo.mcpmInstalledPackages
			"0.1.0".should.equal installedPackages[ "fake-package" ]

		it "should add 'mcpmInstalledPackages' field if it's not there yet", ->
			fixture = loadFixture()
			actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]
			delete actualInfo.mcpmInstalledPackages
			fs.writeFileSync pathToTheFixture, JSON.stringify fixture, null, 2

			minecraftUtils.addInstalledPackage "fake-package", "0.1.0"
			profile = minecraftUtils.getCurrentProfile()
			installedPackages = profile.installedPackages
			"0.1.0".should.equal installedPackages[ "fake-package" ]

			fixture = loadFixture()
			actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]
			installedPackages = actualInfo.mcpmInstalledPackages
			"0.1.0".should.equal installedPackages[ "fake-package" ]
