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
