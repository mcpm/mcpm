chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"
proxyquire = require "proxyquire"

# Disabling logging in tests.
require( "winston" ).level = Infinity

describe "install.fromFolder", ->

	it "reads and checks package config", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.be.an.instanceof Error
		result.message.should.contain "config"

	it "returns an Error when install executable exits with error", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
			"./validateManifest": ->
				install_executable: "file.jar"
			"./invokeInstallExecutable": ( file, dir ) ->
				file.should.equal "file.jar"
				dir.should.equal "test/fixtures/invalid-mod"
				new Error "Something went wrong!"

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.be.an.instanceof Error

	it "doesn't call invokeInstallExecutable when no install_executable", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
				addInstalledPackage: -> true
			"./copyFiles": -> yes
			"./addInstalledPackage": -> yes
			"./validateManifest": -> install_file_list: {}
			"./invokeInstallExecutable", fakeInvoke = sinon.spy()

		fromFolder "test/fixtures/invalid-mod"

		fakeInvoke.should.have.not.been.called

	it "returns an Error when flattenFileList returns an error", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
			"./validateManifest": -> install_file_list: foo: "bar"
			"./flattenFileList": ( list, dir ) ->
				list.should.deep.equal foo: "bar"
				dir.should.equal "test/fixtures/invalid-mod"
				new Error "Something went wrong!"

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.be.an.instanceof Error

	it "returns an Error when copyFiles returns an error", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
			"./validateManifest": -> install_file_list: foo: "bar"
			"./flattenFileList": ( list, dir ) ->
				list.should.deep.equal foo: "bar"
				dir.should.equal "test/fixtures/invalid-mod"
				"copyFiles/foo": "full/bar"
			"./copyFiles": ( list, dir ) ->
				list.should.deep.equal "copyFiles/foo": "full/bar"
				dir.should.equal "test/fixtures/invalid-mod"
				new Error "Something went wrong!"

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.be.an.instanceof Error

	it "first copies files, then invokes installer when there're both", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
			"./validateManifest": ->
				install_executable: "foo"
				install_file_list: bar: "qux"
			"./flattenFileList": ->
			"./invokeInstallExecutable": fakeInvoke = sinon.spy ->
				fakeInvoke.should.have.been.calledOnce
				new Error "Something went wrong!"
			"./copyFiles": ->
				fakeInvoke.should.have.not.been.called

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.be.an.instanceof Error

	it "returns an Error when addInstalledPackage returns an error", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
				addInstalledPackage: ->
					new Error "Something went wrong!"
			"./validateManifest": -> install_executable: "file.jar"
			"./invokeInstallExecutable": -> true

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.be.an.instanceof Error

	it "passes correct name and version to addInstalledPackage", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
				addInstalledPackage: ( name, ver ) ->
					name.should.equal "fake-mod"
					ver.should.equal "1.2.3"
					new Error "Something went wrong!"
			"./validateManifest": ->
				name: "fake-mod"
				version: "1.2.3"
				install_executable: "file.jar"
			"./invokeInstallExecutable": -> true

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.be.an.instanceof Error

	it "returns true when everything goes right", ->
		fromFolder = proxyquire "../../lib/install/fromFolder",
			"../minecraftUtils":
				getCurrentProfile: -> {}
				addInstalledPackage: -> true
			"./validateManifest": ->
				install_executable: "file.jar"
			"./invokeInstallExecutable": -> true

		result = fromFolder "test/fixtures/invalid-mod"
		result.should.equal true
