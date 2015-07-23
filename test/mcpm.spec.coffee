chai = require "chai"
sinon = require "sinon"

# Disabling logging in tests.
require( "winston" ).level = Infinity

mcpm = require "../lib/mcpm.js"

chai.should()
chai.use require "sinon-chai"

install = require "../lib/install"
minecraftUtils = require "../lib/minecraftUtils"

describe "mcpm", ->

	describe "install", ->

		it "returns an Error when parsePackageString returns null", ->
			sinon.stub install, "parsePackageString", -> null
			result = mcpm.install "whatever"
			result.should.be.instanceof Error
			install.parsePackageString.should.have.been.calledOnce
			install.parsePackageString.restore()

		it "calls install.fromFolder when package is of 'folder' type", ->
			sinon.stub install, "parsePackageString", ->
				type: "folder"
				name: "whatever"

			sinon.stub install, "fromFolder", ( dir ) ->
				dir.should.equal "whatever"

			result = mcpm.install "whatever"

			install.fromFolder.should.have.been.calledOnce
			install.fromFolder.restore()
			install.parsePackageString.restore()

	describe "getMinecraftVersion", ->

		it "uses 'minecraftUtils.getCurrentProfile().version'", ->
			sinon.stub minecraftUtils, "getCurrentProfile", ->
				version: "foo.bar.qux"

			result = mcpm.getMinecraftVersion()
			"foo.bar.qux".should.equal result

			minecraftUtils.getCurrentProfile.restore()
