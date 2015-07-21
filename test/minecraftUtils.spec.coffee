chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

minecraftUtils = require "../lib/minecraftUtils.js"

describe "minecraftUtils", ->

	describe "getMinecraftPath", ->

		it "returns path to the Minecraft directory", ->
			os = require "os"
			path = require "path"

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

		currentProfile = null
		before ->
			path = require "path"
			# cwd seems to be outside of test/
			pathToFixtures = path.resolve "test/fixtures"
			sinon.stub minecraftUtils, "getMinecraftPath", -> pathToFixtures

			currentProfile = minecraftUtils.getCurrentProfile()

		after ->
			minecraftUtils.getMinecraftPath.restore()

		it "returns current profile from in originalInfo property", ->
			fixture = require "./fixtures/launcher_profiles.json"
			actualInfo = fixture.profiles[ "1.8 + Forge + LiteLoader" ]

			actualInfo.should.deep.equal currentProfile.originalInfo

		it "returns current Minecraft version in version property", ->
			"1.8".should.equal currentProfile.version
