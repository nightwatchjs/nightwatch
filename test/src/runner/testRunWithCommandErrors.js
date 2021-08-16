const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunWithCommandErrors', function() {

  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  describe('testRunWithWindowCommandErrors', function() {
    it('testRunner with open new window error and report errors on', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        statusCode: 500,
        response: {
          sessionId: null,
          state: 'unhandled error',
          value: {
            message: 'POST /session'
          },
          status: 13
        }
      }, true);

      let testsPath = path.join(__dirname, '../../sampletests/withcommanderrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: true,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 1);
          assert.ok(results.errmessages[0].includes('Error while running .openNewWindow():'));
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errors, 1);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        report_command_errors: true,
        skip_testcases_on_fail: false,
        disable_error_log: 0,
        globals
      }));
    });

    it('testRunner with open new window socket hang up error', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      let testsPath = path.join(__dirname, '../../sampletests/withcommanderrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: true,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 1);
          assert.ok(results.errmessages[0].includes('Error while running .openNewWindow(): Error ECONNRESET: socket hang up'));
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errors, 1);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        webdriver: {
          timeout_options: {
            timeout: 50
          }
        },
        output: false,
        report_command_errors: false,
        skip_testcases_on_fail: false,
        disable_error_log: 0,
        globals
      }));
    });

    it('testRunner with open new window socket hang up error and retry then success', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        statusCode: 200,
        response: {
          value: null
        }
      }, true);

      let testsPath = path.join(__dirname, '../../sampletests/withcommanderrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: true,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 0);
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errors, 0);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        webdriver: {
          timeout_options: {
            timeout: 50,
            retry_attempts: 2
          }
        },
        report_command_errors: true,
        skip_testcases_on_fail: false,
        disable_error_log: 0,
        globals
      }));
    });

    it('testRunner with open new window socket hang up error and retry then success - default settings', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        statusCode: 200,
        response: {
          value: null
        }
      }, true);

      let testsPath = path.join(__dirname, '../../sampletests/withcommanderrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: true,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 0);
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errors, 0);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        webdriver: {
          timeout_options: {
            timeout: 50,
            retry_attempts: 2
          }
        },
        report_command_errors: false,
        globals
      }));
    });

    it('testRunner with open new window socket hang up error and retry then fail', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        socketDelay: 200,
        response: ''
      }, true);

      let testsPath = path.join(__dirname, '../../sampletests/withcommanderrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: true,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 1);
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errors, 1);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        webdriver: {
          timeout_options: {
            timeout: 50,
            retry_attempts: 2
          }
        },
        report_command_errors: true,
        skip_testcases_on_fail: false,
        disable_error_log: 0,
        globals
      }));
    });

    it('testRunner with open new window error and report errors off', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/window/new',
        statusCode: 500,
        response: {
          sessionId: null,
          state: 'unhandled error',
          value: {
            message: 'POST /session'
          },
          status: 13
        }
      }, true);

      let testsPath = path.join(__dirname, '../../sampletests/withcommanderrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: true,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 0);
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errors, 0);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        report_command_errors: false,
        skip_testcases_on_fail: false,
        disable_error_log: 0,
        globals
      }));
    });
  });

  describe('testRunWithElementLocateErrors', function() {

    it('testRunner with element locate errors enabled', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/elements',
        postdata: {
          using: 'css selector',
          value: '#element-error'
        },
        statusCode: 200,
        response: {value: []}
      }, false, true);

      let testsPath = path.join(__dirname, '../../sampletests/withelementerrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: true,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 1);
          assert.strictEqual(results.passed, 0);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 0);
          assert.strictEqual(results.errors, 1);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        skip_testcases_on_fail: false,
        disable_error_log: 0,
        globals
      }));
    });

    it('testRunner with element locate errors disabled', function() {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/elements',
        postdata: {
          using: 'css selector',
          value: '#element-error'
        },
        statusCode: 200,
        response: {value: []}
      }, false, true);

      let testsPath = path.join(__dirname, '../../sampletests/withelementerrors');
      let globals = {
        retryAssertionTimeout: 90,
        abortOnElementLocateError: false,
        waitForConditionTimeout: 90,
        waitForConditionPollInterval: 90,
        reporter(results, cb) {
          assert.strictEqual(results.errmessages.length, 1);
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errors, 1);
          assert.strictEqual(results.skipped, 0);
          cb();
        }
      };

      return runTests({
        _source: [testsPath]
      }, settings({
        globals
      }));
    });

  });
});
