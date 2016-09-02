var Configstore = require('configstore')
var git = require('nodegit')
var github = require('octonode')
var prompt = require('prompt')
var request = require('request')
var TarGz = require('tar.gz')

var conf = new Configstore('bok', { templates: {}, options: {} }, {
  globalConfigPath: 'bok'
})

var targz = new TarGz({}, {
  fromBase: false,
  strip: 1
})

module.exports = function init (name, template) {
  if (!template || typeof template !== 'string') { return onError(err) }

  var path = 'templates.' + template
  var repo = conf.get(path)

  if (!repo) {
    return onError('init: Template `' + template + '` not found!')
  }

  prompt.start()

  var inputs = [{
    name: 'username'
  }, {
    name: 'password'
  }]

  prompt.get(inputs, function (err, result) {
    if (err) { return onError(err) }

    var client = github.client({
      username: result.username,
      password: result.password
    })

    var ghme = client.me()
    var ghrepo = client.repo(repo)

    ghrepo.archive('tarball', function (err, res) {
      var read = request.get(res)
      var write = targz.createWriteStream('/Users/harry/sites/foo')

      read.on('error', onError)
      write.on('error', onError)
      write.on('finish', function() {
        ghme.repo({
          'name': name,
          'description': 'This is your first repo'
        }, 
        function(err, remoteRepo) {
          if (err) { return onError(err) }

          var index, repository

          git.Repository.init('/Users/harry/sites/foo', 0)
            .then(function (repo) {
              repository = repo
              return repo.refreshIndex()
            })
            .then(function (idx) {
              index = idx
              console.log('git: adding files')
              return index.addAll()
            })
            .then(function () {
              console.log('git: writing files')
              return index.writeTree()
            })
            .then(function (oid) {
              console.log('git: committing')
              var author = git.Signature.create('Harry Hedger', 'hedgerh@gmail.com', Math.round(Date.now() / 1000), 60);
              return repository.createCommit("HEAD", author, author, 'Initial commit', oid, []);
            })
            .then(function () {
              console.log('git: adding remote')
              return git.Remote.create(repository, 'origin', remoteRepo.clone_url)
            })
            .then(function (remote) {
              console.log('git: pushing')
              return remote.push(['refs/heads/master:refs/heads/master'], {
                callbacks: {
                  certificateCheck: function () { return 1 },
                  credentials: function (url, userName) {
                    console.log('getting creds for url:' + url + ' username: ' + userName)
                    return git.Cred.sshKeyFromAgent(userName);
                  },
                  transferProgress: function (progress) {
                    console.log('progress: ', progress)
                  }
                }
              })
            })
        })
      })
      read.pipe(write);
    })
  })
}

function onError (err) {
  throw new Error(err)
  return
}