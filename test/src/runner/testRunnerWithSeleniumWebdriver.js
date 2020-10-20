const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunnerWithSeleniumWebdriver', function() {
  this.timeout(10000);

  before(function(done) {
    this.server = MockServer.init();
    this.server.keepAliveTimeout = 500;
    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('test runner using webdriverIO library', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withwebdriver/sampleTestUsingWebdriverIO.js');

    MockServer.addMock({
      url: '/session/13521-10219-202/url',
      method: 'POST',
      response: {
        status: 0,
        value: null
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element',
      method: 'POST',
      postdata: {
        using: 'css selector', value: '#weblogin'
      },
      response: {
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/displayed',
      method: 'GET',
      response: {
        value: true
      }
    }, true, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
      method: 'POST',
      response: {
        status: 0,
        value: null
      }
    }, true, true);

    MockServer.addMock({
      url: '/session/13521-10219-202',
      method: 'DELETE',
      response: {
        status: 0,
        value: null
      }
    }, true);

    let settings = {
      selenium : {
        start_process: false,
      },
      webdriver:{
        port: 10195,
        start_process: false
      },
      silent: false,
      output: true,
      globals: {
        waitForConditionPollInterval:10,
        waitForConditionTimeout:11,
        retryAssertionTimeout: 10,
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 1);
          const testsuite = results.modules.sampleTestUsingWebdriverIO;
          assert.strictEqual(testsuite.assertionsCount, 2);
          assert.strictEqual(testsuite.passedCount, 2);

          const {completed} = testsuite;
          assert.strictEqual(Object.keys(completed).length, 2);
          assert.strictEqual(completed.navigate.passed, 0);
          assert.strictEqual(completed.navigate.tests, 0);

          assert.strictEqual(completed.sampleTest.assertions.length, 2);
          assert.strictEqual(completed.sampleTest.passed, 2);
          assert.strictEqual(completed.sampleTest.tests, 2);
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test runner using selenium-webdriver library', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withwebdriver/sampleTestUsingSeleniumWebdriver.js');

    MockServer.addMock({
      url: '/session/13521-10219-202/url',
      method: 'POST',
      postdata: {
        url: 'http://localhost'
      },
      response: {
        status: 0
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element',
      method: 'POST',
      postdata: {
        using: 'css selector', value: '#weblogin'
      },
      response: {
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
        }
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/displayed',
      method: 'GET',
      response: {
        value: true
      }
    }, true, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
      method: 'POST',
      response: {
        status: 0
      }
    }, true, true);

    MockServer.addMock({
      url: '/session/13521-10219-202',
      method: 'DELETE',
      response: {
        status: 0
      }
    }, true);

    let settings = {
      selenium : {
        start_process: false,
      },
      webdriver:{
        port: 10195,
        start_process: true
      },

      silent: true,
      output: false,
      globals: {
        waitForConditionPollInterval:10,
        waitForConditionTimeout:11,
        retryAssertionTimeout: 10,
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 1);
          const testsuite = results.modules.sampleTestUsingSeleniumWebdriver;
          assert.strictEqual(testsuite.assertionsCount, 2);
          assert.strictEqual(testsuite.passedCount, 2);

          const {completed} = testsuite;
          assert.strictEqual(Object.keys(completed).length, 2);
          assert.strictEqual(completed.navigate.passed, 0);
          assert.strictEqual(completed.navigate.tests, 0);

          assert.strictEqual(completed.sampleTest.assertions.length, 2);
          assert.strictEqual(completed.sampleTest.passed, 2);
          assert.strictEqual(completed.sampleTest.tests, 2);
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });
});
