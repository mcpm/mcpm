/* eslint-env mocha */

let proxyquire = require('proxyquire')

describe('handleInstallFileList', function () {
  it('resolves when no fileList', function (done) {
    let handleInstallFileList = proxyquire('../lib/handleInstallFileList', {
      './install/flattenFileList': () => {
        done(new Error('Should not have called flattenFileList!'))
      },
      './install/copyFiles': () => {
        done(new Error('Should not have called copyFiles!'))
      }
    })

    handleInstallFileList(null, 'fake-folder', 'fake-zip').then(done)
  })

  it('calls flattenFileList and then copyFiles', function (done) {
    let handleInstallFileList = proxyquire('../lib/handleInstallFileList', {
      './install/flattenFileList': (fileList, folderPath, zipPath) => {
        fileList.should.deep.equal({foo: 'bar'})
        folderPath.should.equal('fake-folder')
        zipPath.should.equal('fake-zip')
        return Promise.resolve({foo: 'flattened'})
      },
      './install/copyFiles': (fileList, folderPath, zipPath) => {
        fileList.should.deep.equal({foo: 'flattened'})
        folderPath.should.equal('fake-folder')
        zipPath.should.equal('fake-zip')
        return Promise.resolve()
      }
    })

    handleInstallFileList({foo: 'bar'}, 'fake-folder', 'fake-zip').then(done)
  })
})
