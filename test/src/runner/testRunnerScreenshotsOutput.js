const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const rimraf = require('rimraf');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunnerScreenshotsOutput', function () {
  this.timeout(10000);
  const screenshotFilePath = 'screenshots';
  const moduleName = 'sample';

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      rimraf(screenshotFilePath, done);
    });
  });

  afterEach(function(done) {
    rimraf(screenshotFilePath, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, function() {
      rimraf(screenshotFilePath, done);
    });
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('takes screenshot on each test failure', function () {
    let testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'c2NyZWVuZGF0YQ=='
      })
    }, true);

    return runTests(testsPath, settings({
      skip_testcases_on_fail: false,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    }))
      .then(_ => {
        return readDirPromise(`${screenshotFilePath}/${moduleName}`);
      })
      .then(files => {
        assert.ok(Array.isArray(files));
        assert.strictEqual(files.length, 1);
        files.forEach((val) => assert.ok(val.endsWith('.png')));
      });
  });

  it('takes screenshot for failed test and exits if skip_testcases_on_fail is set to true', function () {

    let testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'c2NyZWVuZGF0YQ=='
      })
    }, true);


    return runTests(testsPath, settings({
      skip_testcases_on_fail: true,
      output_folder: 'output',
      output: false,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    }))
      .then(_ => {
        return readDirPromise(`${screenshotFilePath}/${moduleName}`)
          .then(files => {
            assert.ok(Array.isArray(files));
            assert.strictEqual(files.length, 1);
            files.forEach((val) => assert.ok(val.endsWith('.png')));
          });
      });
  });

  it('doesnt save file if screenshot call is failed', function () {

    let testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      method: 'GET',
      response: JSON.stringify({
        status: -1,
        state: '',
        code: '',
        value: null,
        errorStatus: '',
        error: 'Unknown command 404 Not Found',
        httpStatusCode: 404
      })
    }, true);


    return runTests(testsPath, settings({
      skip_testcases_on_fail: true,
      output_folder: 'output',
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    }))
      .then(_ => {
        return readDirPromise(`${screenshotFilePath}/${moduleName}`)
          .catch(err => {
            assert.ok(err instanceof Error);
            assert.ok(err.message.includes('no such file or directory'));
          });
      });
  });

  it('does not take screenshot if screenshot is disabled', function () {

    let testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    return runTests(testsPath, settings({
      skip_testcases_on_fail: true,
      output_folder: 'output',
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      screenshots: {
        enabled: false,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    }))
      .then(_ => {
        return readDirPromise(`${screenshotFilePath}/${moduleName}`)
          .catch((err) => {
            assert.ok(err instanceof Error);
            assert.ok(err.message.includes('no such file or directory'));
          });
      });
  });

  it('does not take screenshot if screenshot is enabled but on_failure is set to false', function () {

    let testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    return runTests(testsPath, settings({
      skip_testcases_on_fail: true,
      output_folder: 'output',
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      screenshots: {
        enabled: true,
        on_failure: false,
        on_error: true,
        path: screenshotFilePath
      }
    }))
      .then(_ => {
        return readDirPromise(`${screenshotFilePath}/${moduleName}`)
          .catch((err) => {
            assert.ok(err instanceof Error);
            assert.ok(err.message.includes('no such file or directory'));
          });
      });
  });


});

function readDirPromise(dirName) {
  return new Promise(function(resolve, reject) {
    fs.readdir(dirName, function(err, result) {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
}


