const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const NightwatchClient = common.require('index.js');

describe('testRunner ES6 Async', function() {
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

  it('test Runner with ES6 async/await tests basic sample', function() {
    let testsPath = path.join(__dirname, '../../sampletests/es6await');
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [{
          name: 'test_cookie',
          value: '123456',
          path: '/',
          domain: 'example.org',
          secure: false,
          class: 'org.openqa.selenium.Cookie',
          hCode: 91423566
        }]
      })
    }, true);

    let globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        assert.ok('failures/sampleWithFailures' in results.modules, 'sampleWithFailures module not found in results');
        assert.ok('basicSampleTest' in results.modules);
        if (results.modules.basicSampleTest.lastError) {
          throw results.modules.basicSampleTest.lastError;
        }

        if (results.modules['failures/sampleWithFailures'].completed.asyncGetCookiesTest.lastError) {
          throw results.modules['failures/sampleWithFailures'].completed.asyncGetCookiesTest.lastError;
        }

        assert.ok(results.lastError instanceof Error);
        assert.ok(results.lastError.message.includes('is present in 15 ms.'));
        assert.strictEqual(results.lastError.name, 'NightwatchAssertError');
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      skip_testcases_on_fail: false,
      silent: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    });
  });

  it('test Runner with ES6 async/await tests getLog example', function() {
    const testsPath = path.join(__dirname, '../../sampletests/es6await/getlog');
    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      skip_testcases_on_fail: false,
      silent: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    });
  });

  it('test Runner with ES6 async commands', function() {
    const testsPath = path.join(__dirname, '../../sampletests/es6await/getlog');
    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      skip_testcases_on_fail: false,
      silent: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    });
  });
});
