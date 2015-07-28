proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"

pathToPackage = "pkgpath"
pathToMc = "mcpath"

fakeFileList =
	"mods/1.8/./../1.8": "fake.mod"
	"./config": "configfiles/*.cfg"

flattenedFakeFileList =
	"mods/1.8": [ "fake.mod" ]
	"config": [ "configfiles/1.cfg", "configfiles/2.cfg" ]

flattenFileList = proxyquire "../../lib/install/flattenFileList",
	glob: sync: ( glob, opts ) ->
		opts.cwd.should.equal pathToPackage
		if glob is "configfiles/*.cfg"
			[ "configfiles/1.cfg", "configfiles/2.cfg" ]
		else
			[ glob ]

describe "install.flattenFileList", ->

	it "treats items as globs", ->
		flattened = flattenFileList fakeFileList, pathToPackage
		flattened.should.deep.equal flattenedFakeFileList

	it "returns an Error when packageDirectory not specified", ->
		result = flattenFileList fakeFileList
		result.should.be.an.instanceof Error

	it "returns an Error when trying to copy from outside of the package", ->
		result = flattenFileList
			"malicious": "whatever/../.."
		, pathToPackage
		result.should.be.an.instanceof Error

	it "returns an Error when trying to copy from an absolute path", ->
		result = flattenFileList
			"malicious": path.resolve "whatever"
		, pathToPackage
		result.should.be.an.instanceof Error

	it "returns an Error when trying to copy to outside of Minecraft", ->
		result = flattenFileList
			"whatever/../..": "malicious"
		, pathToPackage
		result.should.be.an.instanceof Error

	it "returns an Error when trying to copy to an absolute path", ->
		list = {}
		list[ path.resolve "whatever" ] = "malicious"
		result = flattenFileList list, pathToPackage
		result.should.be.an.instanceof Error

	it "allows to specify arrays of globs", ->
		list =
			"mods/1.8/./../1.8": [ "fake.mod" ]
			"./config": "configfiles/*.cfg"

		result = flattenFileList list, pathToPackage
		result.should.deep.equal flattenedFakeFileList

		it "handles several denormalized paths pointing to the same folder", ->
		list =
			"mods/1.8/./../1.8": "foo"
			"./mods/1.8": "bar"
			"mods/1.8": "qux"

		result = flattenFileList list, pathToPackage
		result.should.deep.equal "mods/1.8": [ "foo", "bar", "qux" ]
