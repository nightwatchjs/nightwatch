const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunWithGlobalReporter', function() {
  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  afterEach(function() {
    Object.keys(require.cache).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunWithGlobalReporter', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let reporterCount = 0;

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results) {
          assert.ok('modules' in results);
          reporterCount++;
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings).then(_ => {
      assert.equal(reporterCount, 1);
    });
  });

  it('testRunner with global async reporter', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let reporterCount = 0;

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok('modules' in results);
          reporterCount++;
          cb();
        }
      },
      output_folder: false,
    };

    return NightwatchClient.runTests(testsPath, settings).then(_ => {
      assert.equal(reporterCount, 1);
    });
  });

  it('testRunner with global async reporter and timeout error', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let reporterCount = 0;

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        customReporterCallbackTimeout: 10,
        reporter(results, cb) {
          assert.ok('modules' in results);
          reporterCount++;
        }
      },
      output_folder: false,
    };

    return NightwatchClient.runTests(testsPath, settings).then(_ => {
      assert.equal(reporterCount, 1);
    }).catch(err => {
      assert.equal(err.message, 'Timeout while waiting (20s) for the custom global reporter callback to be called.');
    });
  });
});