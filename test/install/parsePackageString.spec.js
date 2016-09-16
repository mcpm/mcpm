let chai = require('chai')
let sinon = require('sinon')
chai.should()
let { expect } = chai
chai.use(require('sinon-chai'))

// Disabling logging in tests.
require('winston').level = Infinity

let parsePackageString = require('../../lib/install/parsePackageString')

describe('install.parsePackageString', function () {
  let iterable = [ null, undefined, 100, {}, [ 'folder:some/path' ] ]
  for (let i = 0; i < iterable.length; i++) {
    let obj = iterable[i](obj => it(`classifies non-strings as 'invalid': ${obj}`, function () {
      let parsed = parsePackageString(obj)
      return expect(parsed).to.equal(null)
    }
    )
    )(obj)
  }

  let iterable1 = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  for (let j = 0; j < iterable1.length; j++) {
    var str = iterable1[j](str => it(`classifies any '.zip'-suffixed string as 'zip': ${str}.zip`, function () {
      let parsed = parsePackageString(`${str}.zip`)
      return parsed.should.include({
        type: 'zip',
        name: `${str}.zip`
      })
    }
    )
    )(str)
  }

  let iterable2 = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  for (let k = 0; k < iterable2.length; k++) {
    var str = iterable2[k](str => it(`classifies any other non-prefixed string as 'folder': ${str}`, function () {
      let parsed = parsePackageString(str)
      return parsed.should.include({
        type: 'folder',
        name: str
      })
    }
    )
    )(str)
  }

  let iterable3 = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  for (let i1 = 0; i1 < iterable3.length; i1++) {
    var str = iterable3[i1](str => it(`classifies 'folder'-prefixed string as 'folder': ${str}`, function () {
      let parsed = parsePackageString(`folder:${str}`)
      return parsed.should.include({
        type: 'folder',
        name: str
      })
    }
    )
    )(str)
  }

  let iterable4 = [ '', '-', '1sdf', 'π', 'mcpm/mcpm' ]
  for (let j1 = 0; j1 < iterable4.length; j1++) {
    var str = iterable4[j1](str => it(`classifies 'zip'-prefixed string as 'zip': ${str}`, function () {
      let parsed = parsePackageString(`zip:${str}`)
      return parsed.should.include({
        type: 'zip',
        name: str
      })
    }
    )
    )(str)
  }

  let iterable5 = [ 'a@b', '@', '-@-', '../..@0.0.0', 'mcpm@1.0.0' ]
  for (let k1 = 0; k1 < iterable5.length; k1++) {
    var str = iterable5[k1](str => it(`classifies strings with '@' as 'cache': ${str}`, function () {
      let parsed = parsePackageString(str)
      parsed.should.include({
        type: 'cache',
        name: str.split('@')[ 0 ],
      version: str.split('@')[ 1 ]})
    }
    )
    )(str)
  }

  let iterable6 = [ 'github', 'http', '', 'whatever', 'C' ]
  for (let i2 = 0; i2 < iterable6.length; i2++) {
    let prefix = iterable6[i2](prefix => it(`treats any other prefix as a part of path: ${prefix}`, function () {
      let parsed = parsePackageString(`${prefix}:some/path`)
      return parsed.should.include({
        type: 'folder',
        name: `${prefix}:some/path`
      })
    }
    )
    )(prefix)
  }

  return it("classifies strings with multiple ':' as 'invalid'", function () {
    let parsed = parsePackageString('folder:wtf:is:this')
    return expect(parsed).to.equal(null)
  }
  )
}
)
