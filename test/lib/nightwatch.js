const common = require('../common.js');
const lodashMerge = require('lodash.merge');
const Nightwatch = common.require('index.js');
const Settings = common.require('settings/settings.js');
const MockServer  = require('./mockserver.js');
const Logger = common.require('utils').Logger;

module.exports = new function () {
  let _client = null;
  let _mockServer = null;

  Logger.setOutputEnabled(process.env.VERBOSE === '1' || false);
  Logger.enable();

  this.startMockServer = function (done = function() {}) {
    return new Promise((resolve) => {
      _mockServer = MockServer.init();
      _mockServer.on('listening', () => {
        done();
        resolve();
      });
    });
  };

  const stopMockServer = (done) => {
    if (!_mockServer) {
      return Promise.resolve();
    }

    _mockServer.close(function() {
      done();
    });
  };

  function extendClient(client) {
    client.start = function(done = function() {}) {
      return this.queue.run().then(function(err) {
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
      disable_colors: true,
      globals : {
        myGlobal : 'test'
      }
    };

    lodashMerge(opts, options);

    let settings = Settings.parse(opts);

    return Nightwatch.client(settings, reporter);
  };

  this.createClientDefaults = function() {
    return Nightwatch.client();
  };

  this.init = function(options, callback = function() {}) {
    _client = this.createClient(options);
    extendClient(_client);

    _client.once('nightwatch:session.create', function(id) {
      callback();
    }).once('nightwatch:session.error', function(err) {
      callback(err);
      process.exit(1);
    });

    _client.startSession();
  };

  this.initAsync = function(options, reporter) {
    _client = this.createClient(options, reporter);
    _client.start = function() {
      return this.queue.run().then(err => {
        if (err instanceof Error) {
          throw err;
        }
      });
    };

    return new Promise((resolve, reject) => {
      _client
        .once('nightwatch:session.create', id => resolve(id))
        .once('nightwatch:session.error', err => reject(err));

      _client.createSession().catch(err => reject(err));
    });
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

  this.stop = function(done = function() {}) {
    stopMockServer(done);
  };

  this.addMock = function(mock, once = false) {
    return MockServer.addMock(mock, once);
  };
};
