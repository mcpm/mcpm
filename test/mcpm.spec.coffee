chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

mcpm = require "../lib/mcpm.js"

install = require "../lib/install"
util = require "../lib/util"

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

		it "calls install.fromFolder when package is of 'zip' type", ->
			sinon.stub install, "parsePackageString", ->
				type: "zip"
				name: "whatever"

			sinon.stub install, "fromZip", ( dir ) ->
				dir.should.equal "whatever"

			result = mcpm.install "whatever"

			install.fromZip.should.have.been.calledOnce
			install.fromZip.restore()
			install.parsePackageString.restore()

	describe "getMinecraftVersion", ->

		it "uses 'util.getCurrentProfile().version'", ->
			sinon.stub util, "getCurrentProfile", ->
				version: "foo.bar.qux"

			result = mcpm.getMinecraftVersion()
			"foo.bar.qux".should.equal result

			util.getCurrentProfile.restore()
