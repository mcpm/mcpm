/* eslint-env mocha */

let chai = require('chai')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let parsePackageString = require('../../lib/install/parsePackageString')

describe('install.parsePackageString', function () {
  let names = [ null, undefined, 100, {}, [ 'folder:some/path' ] ]
  names.forEach(obj => it(`classifies non-strings as 'invalid': ${obj}`, function () {
    let parsed = parsePackageString(obj)
    return expect(parsed).to.equal(null)
  }
  )
  )

  names = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  names.forEach(str => it(`classifies any '.zip'-suffixed string as 'zip': ${str}.zip`, function () {
    let parsed = parsePackageString(`${str}.zip`)
    return parsed.should.include({
      type: 'zip',
      name: `${str}.zip`
    })
  }
  )
  )

  names = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  names.forEach(str => it(`classifies any other non-prefixed string as 'folder': ${str}`, function () {
    let parsed = parsePackageString(str)
    return parsed.should.include({
      type: 'folder',
      name: str
    })
  }
  )
  )

  names = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  names.forEach(str => it(`classifies 'folder'-prefixed string as 'folder': ${str}`, function () {
    let parsed = parsePackageString(`folder:${str}`)
    return parsed.should.include({
      type: 'folder',
      name: str
    })
  }
  )
  )

  names = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  names.forEach(str => it(`classifies 'zip'-prefixed string as 'zip': ${str}`, function () {
    let parsed = parsePackageString(`zip:${str}`)
    return parsed.should.include({
      type: 'zip',
      name: str
    })
  }
  )
  )

  names = [ 'a@b', '@', '-@-', '../..@0.0.0', 'mcpm@1.0.0' ]
  names.forEach(str => it(`classifies strings with '@' as 'cache': ${str}`, function () {
    let parsed = parsePackageString(str)
    parsed.should.include({
      type: 'cache',
      name: str.split('@')[ 0 ],
      version: str.split('@')[ 1 ]
    })
  }
  )
  )

  names = [ 'github', 'http', '', 'whatever', 'C' ]
  names.forEach(prefix => it(`treats any other prefix as a part of path: ${prefix}`, function () {
    let parsed = parsePackageString(`${prefix}:some/path`)
    return parsed.should.include({
      type: 'folder',
      name: `${prefix}:some/path`
    })
  }
  )
  )

  it("classifies strings with multiple ':' as 'invalid'", function () {
    let parsed = parsePackageString('folder:wtf:is:this')
    return expect(parsed).to.equal(null)
  }
  )
}
)
