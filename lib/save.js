var fse = require('fs-extra')
var path = require('path')
var git = require('nodegit')

var Configstore = require('configstore')
var conf = new Configstore('bok', { templates: {}, options: {} }, {
  globalConfigPath: 'bok'
})

module.exports = function save (name, repoDir) {
  var location = process.cwd()

  if (typeof repoDir === 'string') {
    location = repoDir
  }

  console.log(location)
  fse.access(path.join(location, '/.git'), fse.F_OK, function (err, res) {
    if (err) {
      return
    }

    
  })
}