const lodashMerge = require('lodash.merge');
const MockServer  = require('./mockserver.js');
const common = require('../common.js');
const Settings = common.require('settings/settings.js');
const {Logger} = common.require('utils');
const Nightwatch = common.require('index.js');

module.exports = new function () {
  let _client = null;
  let _mockServer = null;

  //Logger.setOutputEnabled(process.env.VERBOSE === '1' || false);
  Logger.setOutputEnabled(true);
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

  this.createClient = function(options = {}, reporter = null, argv = {}) {
    let opts = {
      selenium: {
        port: 10195,
        host: 'localhost',
        start_process: false,
        version2: true
      },
      webdriver: {
        start_process: false
      },
      silent: true,
      output: false,
      disable_colors: true,
      globals: {
        myGlobal: 'test'
      }
    };

    lodashMerge(opts, options);

    if (opts.output) {
      Logger.setOutputEnabled(true);
    }

    const settings = Settings.parse(opts);

    return Nightwatch.client(settings, reporter, argv);
  };

  this.createClientDefaults = function() {
    return Nightwatch.client();
  };

  this.init = async function(options, callback = function() {}) {
    _client = this.createClient(options);

    return _client.initialize().then(() => {
      extendClient(_client);

      _client.once('nightwatch:session.create', function(id) {
        callback();
      }).once('nightwatch:session.error', function(err) {
        callback(err);
        process.exit(1);
      });

      _client.startSession();
    });

  };

  this.initAsync = async function(options, reporter) {
    _client = this.createClient(options, reporter);
    await _client.initialize();

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

  this.initW3CClient = function(opts = {}, argv={}) {
    const settings = Object.assign({
      selenium: {
        version2: false,
        start_process: false,
        host: null
      },
      webdriver: {
        start_process: false,
        host: 'localhost'
      }
    }, opts);

    return this.initClient(settings, null, argv);
  };

  this.initClient = async function(options, reporter, argv) {
    const client = this.createClient(options, reporter, argv);
    await client.initialize();

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
