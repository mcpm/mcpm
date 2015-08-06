proxyquire = require "proxyquire"
chai = require "chai"
sinon = require "sinon"
chai.should()
chai.use require "sinon-chai"

# Disabling logging in tests.
require( "winston" ).level = Infinity

describe "util.addInstalledPackage", ->

	it "should add specified module to 'mcpmInstalledPackages'", ->
		addInstalledPackage = proxyquire "../../lib/util/addInstalledPackage",
			"./getCurrentProfile": ->
				originalInfo:
					mcpmInstalledPackages:
						"whatever": "1.2.3"
			"./setCurrentProfile": ( newProfile ) ->
				newProfile.mcpmInstalledPackages.should.deep.equal
					"whatever": "1.2.3"
					"fake-package": "0.1.0"

		addInstalledPackage "fake-package", "0.1.0"

	it "should add 'mcpmInstalledPackages' field if it's not there yet", ->
		addInstalledPackage = proxyquire "../../lib/util/addInstalledPackage",
			"./getCurrentProfile": ->
				originalInfo: {}
			"./setCurrentProfile": ( newProfile ) ->
				"0.1.0".should.equal newProfile.mcpmInstalledPackages[ "fake-package" ]

		addInstalledPackage "fake-package", "0.1.0"
