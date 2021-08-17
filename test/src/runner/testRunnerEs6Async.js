const path = require('path');
const assert = require('assert');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const common = require('../../common.js');
const {settings} = common;
const {runTests} = common.require('index.js');

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

  it('test Runner with ES6 fluent api basic sample', function() {
    let testsPath = path.join(__dirname, '../../sampletests/es6await/selenium/basicSampleTest.js');
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
        assert.ok('basicSampleTest' in results.modules);
        if (results.modules.basicSampleTest.lastError) {
          throw results.modules.basicSampleTest.lastError;
        }
      }
    };

    return runTests(testsPath, settings({
      skip_testcases_on_fail: false,
      globals
    }));
  });

  it('test Runner with ES6 async/await tests basic sample', function() {
    let testsPath = path.join(__dirname, '../../sampletests/es6await/selenium');
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

        assert.ok('failures/sampleWithFailures' in results.modules);
        assert.strictEqual(results.modules['failures/sampleWithFailures'].completed.verify.assertions.length, 2);
        assert.ok(results.modules['failures/sampleWithFailures'].completed.verify.assertions[0].failure.includes('Expected "is present" but got: "not present"'));
        assert.strictEqual(results.modules['failures/sampleWithFailures'].completed.verify.assertions[1].failure, false);
        assert.strictEqual(results.modules['failures/sampleWithFailures'].completed.waitFor.failed, 1);

        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.name, 'NightwatchAssertError');
      }
    };

    return runTests(testsPath, settings({
      skip_testcases_on_fail: false,
      globals
    }));
  });

  it('test Runner with ES6 async/await tests getLog example', function() {
    const testsPath = path.join(__dirname, '../../sampletests/es6await/selenium/getlog');
    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('test Runner with ES6 async/await tests getText example', function() {
    MockServer.addMock({
      url: '/session',
      statusCode: 201,
      postdata: JSON.stringify({
        desiredCapabilities: {browserName: 'firefox', name: 'Get Text ES6'},
        capabilities: {alwaysMatch: {browserName: 'firefox'}}
      }),
      response: JSON.stringify({
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'firefox',
            browserVersion: '65.0.1'
          }
        }
      })
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/url',
      statusCode: 200,
      response: JSON.stringify({
        value: null
      })
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '#element-selector'
      },

      method: 'POST',
      response: JSON.stringify({
        sessionId: '13521-10219-202',
        status: 0,
        value: [{
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }]
      })
    }, false, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/text',
      method: 'GET',
      response: JSON.stringify({
        value: 'sample text value'
      })
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '#signupSection'
      },

      method: 'POST',
      response: JSON.stringify({
        sessionId: '13521-10219-202',
        status: 0,
        value: [{
          'element-6066-11e4-a52e-4f735466cecf': '8b4a-258883ea642b'
        }]
      })
    }, true, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/8b4a-258883ea642b/elements',
      postdata: {
        using: 'css selector',
        value: '#helpBtn'
      },

      method: 'POST',
      response: JSON.stringify({
        sessionId: '13521-10219-202',
        status: 0,
        value: [{
          'element-6066-11e4-a52e-4f735466cecf': '258883ea642b'
        }]
      })
    }, true, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/258883ea642b/text',
      method: 'GET',
      response: JSON.stringify({
        value: 'help text value'
      })
    }, true);

    const testsPath = path.join(__dirname, '../../sampletests/es6await/webdriver/getText');
    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return runTests(testsPath, settings({
      webdriver: {
        host: 'localhost'
      },
      selenium_host: null,
      output: false,
      page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')],
      skip_testcases_on_fail: false,
      globals
    }));
  });

  it('test Runner with ES6 async commands', function() {
    const testsPath = path.join(__dirname, '../../sampletests/es6await/selenium/getlog');
    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });
});
