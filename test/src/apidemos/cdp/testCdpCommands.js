const path = require('path');
const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks');

const mockery = require('mockery');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('cdp commands test', function() {
  beforeEach(function(done) {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    this.server.close(function() {
      done();
    });
  });

  it('reset cdp connection after each session is created', function() {
    const testsPath = [path.join(__dirname, '../../../apidemos/cdp')];
    let resetConnectionCalled = 0;

    mockery.registerMock('../transport/selenium-webdriver/cdp.js', {
      getConnection: function(...args) {
        return Promise.resolve();
      },
      resetConnection: function() {
        resetConnectionCalled += 1;
      }
    });

    Mocks
      .createNewW3CSession({
        persist: true,
        browserName: 'chrome',
        postdata: {
          capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'chrome', 'goog:chromeOptions': {}}}
        }
      })
      .navigateTo({url: 'http://localhost', persist: true});


    const globals = {
      calls: 0,
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 1000,

      reporter(results) {
        // cdp connection is reset once for each session (two test suites).
        assert.strictEqual(resetConnectionCalled, 2);
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: null,
      output: false,
      skip_testcases_on_fail: false,
      globals
    }));
  });

  it('reset cdp connection after each selenium session is created', function() {
    const testsPath = [path.join(__dirname, '../../../apidemos/cdp')];
    let resetConnectionCalled = 0;

    Mocks
      .createChromeSession({
        headless: false,
        times: 2
      });

    MockServer.addMock({
      url: '/wd/hub/session/13521-10219-202/url',
      method: 'POST',
      postdata: JSON.stringify({
        url: 'http://localhost'
      }),
      response: {
        value: null
      },
      times: 2
    });

    mockery.registerMock('../transport/selenium-webdriver/cdp.js', {
      getConnection: function(...args) {
        return Promise.resolve();
      },
      resetConnection: function() {
        resetConnectionCalled += 1;
      }
    });

    const globals = {
      calls: 0,
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 1000,

      reporter(results) {
        // cdp connection is reset once for each session (two test suites).
        assert.strictEqual(resetConnectionCalled, 2);
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium: {
        host: 'localhost',
        port: 10195,
        start_process: false
      },
      output: false,
      skip_testcases_on_fail: false,
      globals
    }));
  });
});
