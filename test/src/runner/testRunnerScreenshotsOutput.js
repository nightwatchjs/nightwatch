const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const NightwatchClient = common.require('index.js');

describe('testRunnerScreenshotsOutput', function() {
  const emptyPath = path.join(__dirname, '../../sampletests/empty/testdir');

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      fs.mkdir(emptyPath, function(err) {
        if (err) {
          return done();
        }
        done();
      });
    });
  });

  afterEach(function(done) {
    fs.rmdirSync('screens/sample', { recursive: true });
    done();
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, function() {
      fs.rmdir(emptyPath, function(err) {
        if (err) {
          return done();
        }
        done();
      });
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
      silent: false,
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
        path: ''
      }
    };


    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readDirPromise('sample')
          .then(files => {
            assert.ok(files);
            assert.deepStrictEqual(files.length, 2);
            files.forEach((val) => assert.match(val.toString(), new RegExp('^.*.(png)$')));
          });
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
        //version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
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
        path: 'screens'
      }
    };


    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readDirPromise('sample')
          .then(files => {
            assert.ok(files)
            assert.strictEqual(files.length, 1);
            files.forEach((val) => assert.match(val.toString(), new RegExp('^.*.(png)$')));
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
        //version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
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
        path: 'screens'
      }
    };


    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readDirPromise('sample')
          .catch((err) => {
            assert.ok(err);
            assert.match(err.message, new RegExp(/no such file or directory/));
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
        //version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
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
        path: ''
      }
    };


    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readDirPromise('sample')
          .catch((err) => {
            assert.ok(err);
            assert.match(err.message, new RegExp(/no such file or directory/));
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