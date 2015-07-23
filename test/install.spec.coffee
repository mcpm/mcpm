chai = require "chai"
sinon = require "sinon"
chai.should()
expect = chai.expect
chai.use require "sinon-chai"

# Disabling logging in tests.
try sinon.stub require "winston"

install = require "../lib/install.js"

glob = require "glob"
path = require "path"
fs = require "fs-extra"
childProcess = require "child_process"
minecraftUtils = require "../lib/minecraftUtils"

describe "install", ->

	describe "parsePackageString", ->

		for obj in [ null, undefined, 100, {}, [ "folder:some/path" ] ]
			do ( obj ) ->
				it "classifies non-strings as 'invalid': #{obj}", ->
					parsed = install.parsePackageString obj
					expect( parsed ).to.equal null

		for str in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
			do ( str ) ->
				it "classifies any non-prefixed string as 'folder': #{str}", ->
					parsed = install.parsePackageString str
					parsed.should.deep.equal
						type: "folder"
						name: str

		for str in [ "", "-", "1sdf", "π", "mcpm/mcpm" ]
			do ( str ) ->
				it "classifies 'folder'-prefixed string as 'folder': #{str}", ->
					parsed = install.parsePackageString "folder:#{str}"
					parsed.should.deep.equal
						type: "folder"
						name: str

		for prefix in [ "github", "http", "", "whatever", ":folder" ]
			do ( prefix ) ->
				it "classifies any other prefix as 'invalid': #{prefix}", ->
					parsed = install.parsePackageString "#{prefix}:some/path"
					expect( parsed ).to.equal null

		it "classifies strings with multiple ':' as 'invalid'", ->
			parsed = install.parsePackageString "folder:wtf:is:this"
			expect( parsed ).to.equal null

	describe "readConfig", ->

		it "reads config inside package and returns its contents", ->
			result = install.readConfig path.resolve "./test/fixtures/fake-mod"
			result.should.be.a "string"

		it "returns null when config not found", ->
			result = install.readConfig path.resolve "./test/fixtures/404"
			expect( result ).to.equal null

	describe "checkConfig", ->

		beforeEach -> sinon.stub install, "readConfig", ( str ) -> str
		afterEach -> install.readConfig.restore()

		it "returns a SyntaxError when invalid JSON", ->
			result = install.checkConfig "{'nope'}"
			result.should.be.an.instanceof SyntaxError

		it "returns an Error when no name", ->
			result = install.checkConfig JSON.stringify
				version: "0.1.0"
				mc: "1.8"
				install_executable: "index.js"
			result.should.be.an.instanceof Error
			result.message.should.contain "name"

		it "returns an Error when no version", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				mc: "1.8"
				install_executable: "index.js"
			result.should.be.an.instanceof Error
			result.message.should.contain "version"

		it "returns an Error when no mc", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				version: "0.1.0"
				install_executable: "index.js"
			result.should.be.an.instanceof Error
			result.message.should.contain "mc"

		for name in [ "", undefined, "-", "1sdf", "π", "mcpm/mcpm" ]
			do ( name ) ->
				it "returns an Error when invalid name: " + name, ->
					result = install.checkConfig JSON.stringify
						name: name
						version: "0.1.0"
						mc: "1.8"
						install_executable: "index.js"
					result.should.be.an.instanceof Error
					result.message.should.contain "name"

		for version in [ "", undefined, "1", "1.2", "1.2.", "1-2-3" ]
			do (version) ->
				it "returns an Error when invalid version: " + version, ->
					result = install.checkConfig JSON.stringify
						name: "fake"
						version: version
						mc: "1.8"
						install_executable: "index.js"
					result.should.be.an.instanceof Error
					result.message.should.contain "version"

		for mc in [ "", undefined, true, "1.", "1.2.", "1-2-3", "all" ]
			do ( mc ) ->
				it "returns an Error when invalid mc: " + mc, ->
					result = install.checkConfig JSON.stringify
						name: "fake"
						version: "0.1.0"
						mc: mc
						install_executable: "index.js"
					result.should.be.an.instanceof Error
					result.message.should.contain "mc"

		it "returns the config when it is valid", ->
			config =
				name: "fake"
				version: "0.1.0"
				mc: "1.8"
				install_executable: "index.js"
			result = install.checkConfig JSON.stringify config
			result.should.deep.equal config

		it "allows install_file_list instead of install_executable", ->
			config =
				name: "fake"
				version: "0.1.0"
				mc: "1.8"
				install_file_list: [ "index.js" ]
			result = install.checkConfig JSON.stringify config
			result.should.deep.equal config

		it "returns an Error when install_file_list is not an array", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				version: "0.1.0"
				mc: "1.8"
				install_file_list: "index.js"
			result.should.be.an.instanceof Error
			result.message.should.contain "install"

		it "returns an Error when no install_file_list/install_executable", ->
			result = install.checkConfig JSON.stringify
				name: "fake"
				version: "0.1.0"
				mc: "1.8"
			result.should.be.an.instanceof Error
			result.message.should.contain "install"

		it "allows custom fields", ->
			config =
				name: "fake"
				version: "0.1.0"
				mc: "1.8"
				install_executable: "index.js"
				custom: "whatever"
				field: 5
			result = install.checkConfig JSON.stringify config
			result.should.deep.equal config

	describe "flattenFileList", ->

		pathToPackage = "pkgpath"
		pathToMc = "mcpath"

		fakeFileList =
			"mods/1.8/./../1.8": "fake.mod"
			"./config": "configfiles/*.cfg"

		flattenedFakeFileList =
			"mods/1.8": [ "fake.mod" ]
			"config": [ "configfiles/1.cfg", "configfiles/2.cfg" ]

		before ->
			sinon.stub glob, "sync", ( glob, opts ) ->
				opts.cwd.should.equal pathToPackage

				if glob is "configfiles/*.cfg"
					[ "configfiles/1.cfg", "configfiles/2.cfg" ]
				else
					[ glob ]

		after ->
			glob.sync.restore()

		it "treats items as globs", ->
			flattened = install.flattenFileList fakeFileList, pathToPackage
			flattened.should.deep.equal flattenedFakeFileList

		it "returns an Error when packageDirectory not specified", ->
			result = install.flattenFileList fakeFileList
			result.should.be.an.instanceof Error

		it "returns an Error when trying to copy from outside of the package", ->
			result = install.flattenFileList
				"malicious": "whatever/../.."
			, pathToPackage
			result.should.be.an.instanceof Error

		it "returns an Error when trying to copy from an absolute path", ->
			result = install.flattenFileList
				"malicious": path.resolve "whatever"
			, pathToPackage
			result.should.be.an.instanceof Error

		it "returns an Error when trying to copy to outside of Minecraft", ->
			result = install.flattenFileList
				"whatever/../..": "malicious"
			, pathToPackage
			result.should.be.an.instanceof Error

		it "returns an Error when trying to copy to an absolute path", ->
			list = {}
			list[ path.resolve "whatever" ] = "malicious"
			result = install.flattenFileList list, pathToPackage
			result.should.be.an.instanceof Error

	describe "copyFiles", ->

		beforeEach ->
			sinon.stub minecraftUtils, "getMinecraftPath", -> "mcpath"
			sinon.stub fs, "copySync", ( from, to ) ->
				if from.includes "from.file"
					to.should.equal path.join "mcpath", "foo/bar/to/from.file"
				else
					to.should.equal path.join "mcpath", "foo/bar/to/dir"

		afterEach ->
			minecraftUtils.getMinecraftPath.restore()
			fs.copySync.restore()

		it "safely copies files and folders using fs-extra#copySync", ->
			install.copyFiles
				"foo/bar/to": [ "whatever/from.file", "whatever/from/dir" ]
			, "pkgpath"

	describe "invokeInstallExecutable", ->

		before ->
			sinon.stub minecraftUtils, "getMinecraftPath", -> "mcpath"

		after ->
			minecraftUtils.getMinecraftPath.restore()

		afterEach ->
			childProcess.spawnSync.restore()

		it "returns an Error when trying to call a file outside of package", ->
			sinon.stub childProcess, "spawnSync", ( file, args, opts ) ->

			result = install.invokeInstallExecutable "foo/../../bar.jar",
				"malicious"
			result.should.be.an.instanceof Error

			childProcess.spawnSync.should.have.not.been.called

		it "invokes install executable", ->
			sinon.stub childProcess, "spawnSync", ( file, args, opts ) ->
				fullPath = path.join "fixtures/fake-mod", "fake.jar"
				file.should.equal fullPath
				opts.cwd.should.equal "fixtures/fake-mod"
				opts.env.should.deep.equal
					MCPM: "1"
					PATH_TO_MINECRAFT: "mcpath"

			install.invokeInstallExecutable "fake.jar", "fixtures/fake-mod"

			childProcess.spawnSync.should.have.been.calledOnce

		it "returns an Error when install executable exists with error", ->
			sinon.stub childProcess, "spawnSync", ( file, args, opts ) ->
				throw new Error "Something went wrong!"

			result = install.invokeInstallExecutable "fake.jar", "fake-mod"
			result.should.be.an.instanceof Error

	describe "fromFolder", ->

		it "reads and checks package config", ->
			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.be.an.instanceof Error
			result.message.should.contain "config"

		it "returns an Error when install executable exits with error", ->
			sinon.stub install, "checkConfig", ->
				install_executable: "file.jar"

			sinon.stub install, "invokeInstallExecutable", ( file, dir ) ->
				file.should.equal "file.jar"
				dir.should.equal "test/fixtures/invalid-mod"
				new Error "Something went wrong!"

			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.be.an.instanceof Error

			install.checkConfig.restore()
			install.invokeInstallExecutable.restore()

		it "doesn't call invokeInstallExecutable when no install_executable", ->
			sinon.stub install, "copyFiles", -> yes
			sinon.stub minecraftUtils, "addInstalledPackage", -> yes

			sinon.stub install, "checkConfig", ->
				install_file_list: {}

			sinon.stub install, "invokeInstallExecutable", ->

			install.fromFolder "test/fixtures/invalid-mod"

			install.checkConfig.restore()
			install.invokeInstallExecutable.should.have.not.been.called
			install.invokeInstallExecutable.restore()
			install.copyFiles.restore()
			minecraftUtils.addInstalledPackage.restore()

		it "returns an Error when flattenFileList returns an error", ->
			sinon.stub install, "checkConfig", ->
				install_file_list: foo: "bar"

			sinon.stub install, "flattenFileList", ( list, dir ) ->
				list.should.deep.equal foo: "bar"
				dir.should.equal "test/fixtures/invalid-mod"
				new Error "Something went wrong!"

			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.be.an.instanceof Error

			install.checkConfig.restore()
			install.flattenFileList.restore()

		it "returns an Error when copyFiles returns an error", ->
			sinon.stub install, "checkConfig", ->
				install_file_list: foo: "bar"

			sinon.stub install, "flattenFileList", ( list, dir ) ->
				list.should.deep.equal foo: "bar"
				dir.should.equal "test/fixtures/invalid-mod"
				"copyFiles/foo": "full/bar"

			sinon.stub install, "copyFiles", ( list, dir ) ->
				list.should.deep.equal "copyFiles/foo": "full/bar"
				dir.should.equal "test/fixtures/invalid-mod"
				new Error "Something went wrong!"

			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.be.an.instanceof Error

			install.copyFiles.restore()
			install.checkConfig.restore()
			install.flattenFileList.restore()

		it "first copies files, then invokes installer when there're both", ->
			sinon.stub install, "checkConfig", ->
				install_executable: "foo"
				install_file_list: bar: "qux"

			sinon.stub install, "flattenFileList", ->

			sinon.stub install, "copyFiles", ->
				install.invokeInstallExecutable.should.have.not.been.called
			sinon.stub install, "invokeInstallExecutable", ->
				install.invokeInstallExecutable.should.have.been.calledOnce
				new Error "Something went wrong!"

			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.be.an.instanceof Error

			install.copyFiles.restore()
			install.checkConfig.restore()
			install.flattenFileList.restore()
			install.invokeInstallExecutable.restore()

		it "returns an Error when addInstalledPackage returns an error", ->
			sinon.stub install, "checkConfig", ->
				install_executable: "file.jar"

			sinon.stub install, "invokeInstallExecutable", -> true

			sinon.stub minecraftUtils, "addInstalledPackage", ->
				new Error "Something went wrong!"

			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.be.an.instanceof Error

			install.checkConfig.restore()
			install.invokeInstallExecutable.restore()
			minecraftUtils.addInstalledPackage.restore()

		it "passes correct name and version to addInstalledPackage", ->
			sinon.stub install, "checkConfig", ->
				name: "fake-mod"
				version: "1.2.3"
				install_executable: "file.jar"

			sinon.stub install, "invokeInstallExecutable", -> true

			sinon.stub minecraftUtils, "addInstalledPackage", ( name, ver ) ->
				name.should.equal "fake-mod"
				ver.should.equal "1.2.3"
				new Error "Something went wrong!"

			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.be.an.instanceof Error

			install.checkConfig.restore()
			install.invokeInstallExecutable.restore()
			minecraftUtils.addInstalledPackage.restore()

		it "returns true when everything goes right", ->
			sinon.stub install, "checkConfig", -> install_executable: "file.jar"
			sinon.stub install, "invokeInstallExecutable", -> true
			sinon.stub minecraftUtils, "addInstalledPackage", -> true

			result = install.fromFolder "test/fixtures/invalid-mod"
			result.should.equal true

			install.checkConfig.restore()
			install.invokeInstallExecutable.restore()
			minecraftUtils.addInstalledPackage.restore()
