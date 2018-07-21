const common = require('../common.js');
const lodashMerge = require('lodash.merge');
const nightwatch = common.require('index.js');
const Settings = common.require('settings/settings.js');
const Logger = common.require('util/logger.js');

module.exports = new function () {
  let _client = null;

  Logger.setOutputEnabled(false);
  Logger.disable(false);

  function extendClient(client) {
    client.start = function(done = function() {}) {
      return this.queue.run(function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
    };
  }

  this.createClient = function(options = {}, reporter = null) {
    let opts = {
      selenium : {
        port: 10195,
        start_process: true,
        version2: true
      },
      webdriver:{
        start_process: false
      },
      silent : true,
      output : false,
      globals : {
        myGlobal : 'test'
      }
    };

    lodashMerge(opts, options);

    let settings = Settings.parse(opts);

    return nightwatch.client(settings, reporter);
  };

  this.createClientDefaults = function() {
    return nightwatch.client();
  };

  this.init = function(options, callback = function() {}) {
    _client = this.createClient(options);

    extendClient(_client);

    _client.once('nightwatch:session.create', function(id) {
      callback();
    }).once('nightwatch:session.error', function(err) {
      callback();
      process.exit(1);
    });

    _client.startSession();
  };

  this.initClient = function(options, reporter) {
    let client = this.createClient(options, reporter);

    extendClient(client);

    return new Promise(function(resolve, reject) {
      client.once('nightwatch:session.create', function(id) {
        resolve(client);
      }).once('nightwatch:session.error', function(err) {
        reject(err);
      });

      client.startSession();
    });
  };

  this.api = function() {
    return _client.api;
  };

  this.client = function() {
    return _client;
  };

  this.start = function(done) {
    return _client.start(done);
  };
};
