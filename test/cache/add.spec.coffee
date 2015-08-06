proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

path = require "path"

describe "cache.add", ->

	it "adds specified zip to cache", ->
		dest = path.join "fake-.mcpm", "cache", "fake-package", "1.2.3"
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"

		fakeCopySync = sinon.mock().withArgs "path/to/src.zip", path.join dest, "mcpm-package.zip"
		fakeOutputJsonSync = sinon.stub()

		add = proxyquire "../../lib/cache/add",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				copySync: fakeCopySync
				outputJsonSync: fakeOutputJsonSync

		add "path/to/src.zip", fakeManifest

		fakeCopySync.verify()

	it "adds the package manifest to cache", ->
		dest = path.join "fake-.mcpm", "cache", "fake-package", "1.2.3"
		fakeManifest =
			name: "fake-package"
			version: "1.2.3"

		fakeCopySync = sinon.stub()
		fakeOutputJsonSync = sinon.mock().withArgs fakeManifest, path.join dest, "mcpm-package.json"

		add = proxyquire "../../lib/cache/add",
			"../util":
				getPathToMcpmDir: -> "fake-.mcpm"
			"fs-extra":
				copySync: fakeCopySync
				outputJsonSync: fakeOutputJsonSync

		add "path/to/src.zip", fakeManifest

		fakeOutputJsonSync.verify()
