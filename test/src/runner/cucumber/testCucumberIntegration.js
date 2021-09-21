const common = require('../../../common');
const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const MockServer = require('../../../lib/mockserver');
const CucumberRunner = common.require('runner/test-runners/cucumber');

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
    let settings = {
      test_runner: {
        options: {
          feature_path: path.join(__dirname, '../../../cucumbertests/sample.feature')
        }
      },
      selenium: {
        port: 10195,
        version2: true,
        start_process: false
      },
      persist_globals: true,
      globals: {
        test_calls: 0,
        retryAssertionTimeout: 0
      },
      output: false,
      silent: false,
      output_folder: false
    };


    const cucumberRunner = new CucumberRunner(settings, {tags: ['@pass']}, {});
    const modules = [path.join(__dirname, '../../../cucumbertests/testSample.js')];

    return cucumberRunner.runTests(modules).then(({reporter}) =>
      assert.ok(reporter.allTestsPassed));

  });

  it('testCucumberSampleTests with failures', function() {
    let settings = {
      test_runner: {
        options: {
          feature_path: path.join(__dirname, '../../../cucumbertests/sample.feature')
        }
      },
      selenium: {
        port: 10195,
        version2: true,
        start_process: false
      },
      persist_globals: true,
      globals: {
        test_calls: 0,
        retryAssertionTimeout: 0
      },
      output: false,
      silent: false,
      output_folder: false
    };


    const cucumberRunner = new CucumberRunner(settings, {tags: ['@fail']}, {});
    const modules = [path.join(__dirname, '../../../cucumbertests/testWithFailures.js')];

    return cucumberRunner.runTests(modules).then(({reporter}) => {
      assert.ok(!reporter.allTestsPassed);
      assert.strictEqual(reporter.testResults.lastError.name, 'NightwatchAssertError');
    }
    );
  });






});
