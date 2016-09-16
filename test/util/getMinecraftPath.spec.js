chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

getMinecraftPath = require "../../lib/util/getMinecraftPath"

os = require "os"
path = require "path"

describe "util.getMinecraftPath", ->

	it "returns path to the Minecraft directory", ->
		originalHome = process.env.HOME
		process.env.HOME = "fakeHome"

		fakeOsPlatform = null
		sinon.stub os, "platform", -> fakeOsPlatform

		fakeOsPlatform = "win32"
		getMinecraftPath().should.equal path.join "fakeHome",
			"AppData", "Roaming", ".minecraft"

		fakeOsPlatform = "linux"
		getMinecraftPath().should.equal path.join "fakeHome",
			".minecraft"

		fakeOsPlatform = "darwin"
		getMinecraftPath().should.equal path.join "fakeHome",
			"Library", "Application Support", "minecraft"

		process.env.HOME = originalHome
		os.platform.restore()
