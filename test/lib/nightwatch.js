const common = require('../common.js');
const nightwatch = common.require('index.js');

module.exports = new function () {
  let _client = null;

  this.createClient = function(options = {}) {
    let opts = {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        myGlobal : 'test'
      }
    };

    Object.assign(opts, options);

    return nightwatch.client(opts);
  };

  this.createClientDefaults = function() {
    return nightwatch.client();
  };

  this.init = function(options, callback) {
    _client = this.createClient(options);

    _client.once('nightwatch:session.create', function(id) {
      if (callback) {
        callback();
      }
    })
    .once('nightwatch:session.error', function() {
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
    _client.removeAllListeners('nightwatch:session.finished');
    if (done) {
      _client.once('nightwatch:session.finished', function(results, errors) {
        done();
      });
    }

    return _client.start();
  };
};
