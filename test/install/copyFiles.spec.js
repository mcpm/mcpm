proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"

describe "install.copyFiles", ->

	it "safely copies files and folders using fs-extra#copy", ( done ) ->
		copyFiles = proxyquire "../../lib/install/copyFiles",
			"../util":
				getMinecraftPath: -> "mcpath"
			"fs-extra":
				copy: ( from, to, callback ) ->
					if from.includes "from.file"
						to.should.equal path.join "mcpath", "foo/bar/to/from.file"
					else
						to.should.equal path.join "mcpath", "foo/bar/to/dir"
					setTimeout callback

		copyFiles
			fileList:
				"foo/bar/to": [ "whatever/from.file", "whatever/from/dir" ]
			packageRoot: "pkgpath"
			callback: ( err ) ->
				expect( err ).to.equal null
				done()

	it "copies the package zip when trying to copy it", ( done ) ->
		copyFiles = proxyquire "../../lib/install/copyFiles",
			"../util":
				getMinecraftPath: -> "mcpath"
			"fs-extra":
				copy: ( from, to, callback ) ->
					from.should.equal "/fake/path/to/package.zip"
					to.should.equal path.join "mcpath", "foo/bar/to/package.zip"
					setTimeout callback

		copyFiles
			fileList:
				"foo/bar/to": [ "/fake/path/to/package.zip" ]
			packageRoot: "pkgpath"
			zipPath: "/fake/path/to/package.zip"
			callback: ( err ) ->
				expect( err ).to.equal null
				done()

	it "returns an error if fs.copy fails", ( done ) ->
		copyFiles = proxyquire "../../lib/install/copyFiles",
			"../util":
				getMinecraftPath: -> "mcpath"
			"fs-extra":
				copy: ( from, to, callback ) ->
					setTimeout ->
						callback new Error "Oh, snap!"

		copyFiles
			fileList:
				"oh": [ "snap" ]
			packageRoot: "pkgpath"
			callback: ( err ) ->
				err.should.be.an.instanceof Error
				done()
