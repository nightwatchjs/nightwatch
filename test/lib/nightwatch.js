var common = require('../common.js');
var nightwatch = common.require('index.js');

module.exports = new function () {
  var _client = null;

  this.createClient = function(options) {
    var opts = {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        myGlobal : 'test'
      }
    };

    if (options) {
      for (var prop in options) {
        opts[prop] = options[prop];
      }
    }

    return nightwatch.client(opts);
  };

  this.init = function(options, callback) {
    _client = this.createClient(options);

    _client.once('selenium:session_create', function(id) {
      if (callback) {
        callback();
      }
    })
    .once('error', function() {
      if (callback) {
        callback();
      }
      process.exit(1);
    });

    _client.startSession();
  };

  this.api = function() {
    return _client.api;
  };

  this.client = function() {
    return _client;
  };

  this.start = function(done) {
    _client.removeAllListeners('nightwatch:finished');
    if (done) {
      _client.once('nightwatch:finished', function(results, errors) {
        done();
      });
    }

    return _client.start();
  };
};
