var Configstore = require('configstore')
var conf = new Configstore('bok', { templates: {}, options: {} }, {
  globalConfigPath: 'bok'
})

exports.addTemplate = function addTemplate (id, url, force) {
  console.log('add')
  var key = 'templates.' + id
  if (!conf.get(key) || force) {
    conf.set(key, url)
  }
}

exports.getTemplate = function getTemplate (id ,opts) {
  var key = 'templates.' + id
  console.log(conf.get(key))
}

exports.setTemplate = function setTemplate (id, url) {
  var key = 'templates.' + id
  conf.set(key, url)
  console.log(conf.get(key))
}

exports.listTemplates = function listTemplates () {
  var templates = conf.get('templates')
  console.log(templates)
}

exports.removeTemplate = function removeTemplate (id) {
  var key = 'templates.' + id
  conf.delete(key)
  return conf.get(key)
}