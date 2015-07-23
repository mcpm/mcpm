proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"
copyFiles = proxyquire "../../lib/install/copyFiles",
	"../minecraftUtils":
		getMinecraftPath: -> "mcpath"
	"fs-extra":
		copySync: ( from, to ) ->
			if from.includes "from.file"
				to.should.equal path.join "mcpath", "foo/bar/to/from.file"
			else
				to.should.equal path.join "mcpath", "foo/bar/to/dir"

describe "install.copyFiles", ->

	it "safely copies files and folders using fs-extra#copySync", ->
		copyFiles
			"foo/bar/to": [ "whatever/from.file", "whatever/from/dir" ]
		, "pkgpath"
