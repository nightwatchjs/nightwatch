const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunnerSessionCreate', function() {
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

  it('testRunner with session create error using webdriver', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/async')
    ];

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        desiredCapabilities: {browserName: 'firefox', name: 'Async/Test/Sample'},
        capabilities: {alwaysMatch: {browserName: 'firefox'}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        desiredCapabilities: {browserName: 'firefox', name: 'test-Name'},
        capabilities: {alwaysMatch: {browserName: 'firefox'}}
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    let globals = {
      reporter(results) {
        const sep = path.sep;
        assert.strictEqual(results.errors, 2);
        assert.strictEqual(Object.keys(results.modules).length, 2);
        assert.ok(Object.keys(results.modules).includes(`async${sep}test${sep}sample`));
        assert.ok(Object.keys(results.modules).includes(`simple${sep}test${sep}sample`));
        assert.ok(results.lastError instanceof Error);

        assert.strictEqual(results.lastError.message, 'An error occurred while retrieving a new session: [SessionNotCreatedError] Session is already started');
      }
    };

    return runTests(testsPath, settings({
      selenium_host: null,
      webdriver: {
        host: 'localhost'
      },
      globals,
      output: false,
      output_folder: false
    }));
  });

  it('testRunner with session ECONNREFUSED error using webdriver', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/async')
    ];

    let globals = {
      reporter(results) {
        assert.strictEqual(results.errors, 1);
        assert.strictEqual(results.errmessages.length, 1);
        assert.strictEqual(Object.keys(results.modules).length, 1);

        assert.strictEqual(results.lastError.sessionCreate, true);
        assert.strictEqual(results.lastError.sessionConnectionRefused, true);
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.code, 'ECONNREFUSED');
        assert.strictEqual(results.lastError.message, 'An error occurred while retrieving a new session: Connection refused to 127.0.0.1:5050. If the Webdriver/Selenium service is managed by Nightwatch, check if "start_process" is set to "true".');
      }
    };

    return runTests(testsPath, settings({
      selenium_host: null,
      webdriver: {
        host: 'localhost',
        port: 5050
      },
      globals
    })).catch(err => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.code, 'ECONNREFUSED');
      assert.strictEqual(err.sessionCreate, true);
      assert.strictEqual(err.sessionConnectionRefused, true);
    });
  });
});
