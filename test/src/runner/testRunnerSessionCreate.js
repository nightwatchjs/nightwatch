const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const NightwatchClient = common.require('index.js');

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
        capabilities: {
          browserName: 'firefox',
          name: 'Async/Test/Sample'
        },
        desiredCapabilities: {
          browserName: 'firefox',
          platform: 'ANY',
          name: 'Async/Test/Sample'
        }
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
        capabilities: {
          browserName: 'firefox',
          name: 'test-Name'
        },
        desiredCapabilities: {
          browserName: 'firefox',
          platform: 'ANY',
          name: 'test-Name'
        }
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
        assert.equal(results.errors, 2);
        assert.equal(Object.keys(results.modules).length, 2);
        assert.ok(Object.keys(results.modules).includes(`async${sep}test${sep}sample`));
        assert.ok(Object.keys(results.modules).includes(`simple${sep}test${sep}sample`));
        assert.ok(results.lastError instanceof Error);
        assert.ok(results.lastError.message.includes('An error occurred while retrieving a new session: ' +
          '"Session is already started"'));
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: false,
        start_process: false
      },
      webdriver: {
        start_process: true
      },
      output: process.env.VERBOSE === '1' || false,
      silent: false,
      globals: globals,
      output_folder: false
    });
  });

  it('testRunner with session ECONNREFUSED error using webdriver', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/async')
    ];

    let globals = {
      reporter(results) {
        assert.equal(results.errors, 1);
        assert.equal(results.errmessages.length, 1);
        assert.equal(Object.keys(results.modules).length, 1);

        assert.strictEqual(results.lastError.sessionCreate, true);
        assert.strictEqual(results.lastError.sessionConnectionRefused, true);
        assert.ok(results.lastError instanceof Error);
        assert.equal(results.lastError.code, 'ECONNREFUSED');
        assert.ok(results.lastError.message.includes('An error occurred while retrieving a new session: "Connection refused to 127.0.0.1:1000". If the Webdriver/Selenium service is managed by Nightwatch, check if "start_process" is set to "true".'));
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 1000,
        version2: false,
        start_process: false
      },
      webdriver: {
        start_process: true
      },
      output: process.env.VERBOSE === '1' || false,
      silent: false,
      globals: globals,
      output_folder: false
    }).catch(err => {
      assert.ok(err instanceof Error);
      assert.equal(err.code, 'ECONNREFUSED');
      assert.strictEqual(err.sessionCreate, true);
      assert.strictEqual(err.sessionConnectionRefused, true);
    });
  });
});
