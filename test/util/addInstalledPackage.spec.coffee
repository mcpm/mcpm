proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"
fs = require "fs"
getCurrentProfile = require "../../lib/util/getCurrentProfile"

# cwd seems to be outside of test/
pathToFixtures = path.resolve "test/fixtures"
pathToTheFixture = path.join pathToFixtures, "launcher_profiles.json"
profileName = "1.8 + Forge + LiteLoader"

loadFixture = ->
	JSON.parse fs.readFileSync pathToTheFixture, encoding: "utf-8"

addInstalledPackage = proxyquire "../../lib/util/addInstalledPackage",
	"./getMinecraftPath": -> pathToFixtures

describe "util.addInstalledPackage", ->

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
		addInstalledPackage "fake-package", "0.1.0"
		profile = getCurrentProfile()
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

		addInstalledPackage "fake-package", "0.1.0"
		profile = getCurrentProfile()
		installedPackages = profile.installedPackages
		"0.1.0".should.equal installedPackages[ "fake-package" ]

		fixture = loadFixture()
		actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]
		installedPackages = actualInfo.mcpmInstalledPackages
		"0.1.0".should.equal installedPackages[ "fake-package" ]
