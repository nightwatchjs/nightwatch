const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const NightwatchClient = common.require('index.js');
const utils = common.require('utils/index.js');
const rimraf = require('rimraf');

describe('testRunnerScreenshotsOutput', function() {
  let screenshotFilePath = 'screenshots';
  let moduleName = 'sample';

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      if (utils.dirExistsSync(screenshotFilePath)) {
        rimraf.sync(screenshotFilePath);
      }
      done();
    });
  });

  afterEach(function(done) {
    if (utils.dirExistsSync(screenshotFilePath)) {
      rimraf.sync(screenshotFilePath);
    }
    done();
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, function() {
      if (utils.dirExistsSync(screenshotFilePath)) {
        rimraf.sync(screenshotFilePath);
      }
      done();
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

    let settings = {
      skip_testcases_on_fail: false,
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: true,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      output: false,
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    };

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/screenshot',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value:'screendata'
      })
    }, true);

    return NightwatchClient.runTests(testsPath, settings)
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

    let settings = {
      skip_testcases_on_fail: true,
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: true,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      output: false,
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    };

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/screenshot',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value:'screendata'
      })
    });


    return NightwatchClient.runTests(testsPath, settings)
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

    let settings = {
      skip_testcases_on_fail: true,
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: true,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      output: false,
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    };

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/screenshot',
      method:'GET',
      response : JSON.stringify({
        status: -1,
        state: '',
        code: '',
        value: null,
        errorStatus: '',
        error: 'Unknown command 404 Not Found',
        httpStatusCode: 404
      })
    });


    return NightwatchClient.runTests(testsPath, settings)
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

    let settings = {
      skip_testcases_on_fail: true,
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: true,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      output: false,
      screenshots: {
        enabled: false,
        on_failure: true,
        on_error: true,
        path: screenshotFilePath
      }
    };


    return NightwatchClient.runTests(testsPath, settings)
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

    let settings = {
      skip_testcases_on_fail: true,
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: true,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function () {
        }
      },
      output: false,
      screenshots: {
        enabled: true,
        on_failure: false,
        on_error: true,
        path: screenshotFilePath
      }
    };


    return NightwatchClient.runTests(testsPath, settings)
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


