chai = require "chai"
sinon = require "sinon"
# using compiled JavaScript file here to be sure module works
mcpm = require "../lib/mcpm.js"

chai.should()
chai.use require "sinon-chai"

describe "mcpm", ->
	it "works", ->
		actual = mcpm "World"
		actual.should.equal "Hello World"
