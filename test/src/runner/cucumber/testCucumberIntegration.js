const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const common = require('../../../common.js');
const MockServer = require('../../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('test Cucumber integration', function() {
  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  after(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testCucumberSampleTests', function() {
    const source = [path.join(__dirname, '../../../cucumbertests/testSample.js')];

    const globals = {
      test_calls: 0
    };

    return runTests({
      source,
      tags: ['@pass']
    }, settings({
      globals,
      test_runner: {
        type: 'cucumber',
        options: {
          feature_path: path.join(__dirname, '../../../cucumbertests/sample.feature')
        }
      },
      output: false,
      silent: false
    })).then(_ => {
      assert.strictEqual(globals.test_calls, 2);
    });
  });

  it('testCucumberSampleTests with failures', function() {
    const source = [path.join(__dirname, '../../../cucumbertests/testWithFailures.js')];

    const globals = {
      test_calls: 0,
      retryAssertionTimeout: 100,
      waitForConditionTimeout: 100,
      waitForConditionPollInterval: 10
    };

    return runTests({
      source,
      tags: ['@fail']
    }, settings({
      globals,
      test_runner: {
        type: 'cucumber',
        options: {
          feature_path: path.join(__dirname, '../../../cucumbertests/sample.feature')
        }
      },
      output: false,
      silent: false
    }))
      .then(_ => {
        assert.strictEqual(globals.test_calls, 2);
      });
  });
});