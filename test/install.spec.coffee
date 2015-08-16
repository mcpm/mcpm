proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

describe "install", ->

	it "returns an Error when parsePackageString returns null", ->
		fakeParsePackageString = sinon.stub().returns null

		install = proxyquire "../lib/install",
			"./install/parsePackageString": fakeParsePackageString

		result = install "whatever"

		result.should.be.instanceof Error

	it "calls install.fromFolder when package is of 'folder' type", ->
		fakeParsePackageString = sinon.stub().returns
			type: "folder"
			name: "whatever"

		fakeFromFolder = sinon.mock().once().withExactArgs "whatever"

		install = proxyquire "../lib/install",
			"./install/parsePackageString": fakeParsePackageString
			"./install/fromFolder": fakeFromFolder

		result = install "whatever"

		fakeFromFolder.verify()

	it "calls install.fromZip when package is of 'zip' type", ->
		fakeParsePackageString = sinon.stub().returns
			type: "zip"
			name: "whatever"

		fakeFromZip = sinon.mock().once().withExactArgs "whatever"

		install = proxyquire "../lib/install",
			"./install/parsePackageString": fakeParsePackageString
			"./install/fromZip": fakeFromZip

		result = install "whatever"

		fakeFromZip.verify()

	it "calls install.fromCache when package is of 'cache' type", ->
		fakeParsePackageString = sinon.stub().returns
			type: "cache"
			name: "whatever"
			version: "fake-version"

		fakeFromCache = sinon.mock().once().withExactArgs "whatever", "fake-version"

		install = proxyquire "../lib/install",
			"./install/parsePackageString": fakeParsePackageString
			"./install/fromCache": fakeFromCache

		result = install "whatever"

		fakeFromCache.verify()
