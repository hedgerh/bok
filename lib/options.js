var Configstore = require('configstore')
var conf = new Configstore('bok', { templates: {}, options: {} }, {
  globalConfigPath: 'bok'
})

exports.getOption = function getOption (key) {
  var value = conf.get('options.' + key)
  console.log(value)
  return value
}

exports.setOption = function setOption (key, value) {
  return conf.set('options.' + key, value)
}

exports.deleteOption = function deleteOption (key) {
  conf.delete('options.' + key)
}

exports.listOptions = function listOptions () {
  console.log(conf.all)
}
