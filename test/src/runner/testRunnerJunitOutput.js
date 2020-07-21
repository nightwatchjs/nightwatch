const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const NightwatchClient = common.require('index.js');

describe('testRunnerJUnitOutput', function() {
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

  it('test run screenshots with jUnit output and test failures', function () {

    let testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
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
        return readFilePromise('output/FIREFOX_TEST_TEST_sample.xml');
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.indexOf('<system-out>[[ATTACHMENT|') > 0);
      });
  });

  it('testRun with jUnit output and errors', function () {
    let testsPath = [
      path.join(__dirname, '../../sampletests/witherrors')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter(results) {
          assert.strictEqual(results.assertions, 0);
          assert.strictEqual(results.errmessages.length, 1);
          assert.strictEqual(results.failed, 0);
          assert.strictEqual(results.errors, 1);
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.startsWith('Error in test script'));
          assert.strictEqual(typeof results.modules.sampleWithError, 'object');
          assert.strictEqual(results.modules.sampleWithError.assertionsCount, 0);
          assert.strictEqual(results.modules.sampleWithError.errors, 1);
          assert.strictEqual(results.modules.sampleWithError.failedCount, 0);
          assert.strictEqual(results.modules.sampleWithError.testsCount, 1);
        }
      },
      output: false,
      screenshots: {
        enabled: false
      }
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readFilePromise('output/FIREFOX_TEST_TEST_sampleWithError.xml');
      })
      .then(data => {
        const content = data.toString();
        assert.ok(content.includes('<error message="Error in test script" type="error">'), 'Report should contain error message');
        assert.ok(content.includes('sampleWithError.js'), 'Report should contain stackTrace');
        assert.ok(content.includes('<system-err>'), 'Report should also contain <system-err>');
      });
  });

  it('testRun with jUnit output and failures in before hook', function () {
    let testsPath = [
      path.join(__dirname, '../../asynchookstests/sampleWithAssertionFailedInBefore.js')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter: function (results) {
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errmessages.length, 1);
          assert.strictEqual(results.failed, 1);
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.startsWith('Error while running "equal" command: Failed [equal]: (0 == 1)'));
          assert.strictEqual(typeof results.modules.sampleWithAssertionFailedInBefore, 'object');
          assert.strictEqual(results.modules.sampleWithAssertionFailedInBefore.assertionsCount, 1);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInBefore.errmessages.length, 1);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInBefore.failedCount, 1);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInBefore.skipped.length, 0);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInBefore.completed['demo test async'].assertions.length, 0);
        }
      },
      output: false,
      screenshots: {
        enabled: false
      }
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readFilePromise('output/FIREFOX_TEST_TEST_sampleWithAssertionFailedInBefore.xml');
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.includes('<system-err>'));
        assert.ok(content.indexOf('Failed [equal]: (0 == 1) - expected &#34;1&#34; but got: &#34;0&#34;') > 0, 'Report should contain failure');
        assert.ok(content.indexOf('sampleWithAssertionFailedInBefore.js') > -1, 'Report should contain stack trace');
      });
  });

  it('testRun with jUnit output and errors in after hook', function () {
    let testsPath = [
      path.join(__dirname, '../../asynchookstests/sampleWithAssertionFailedInAfter.js')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter: function (results) {
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errmessages.length, 1);
          assert.strictEqual(results.failed, 1);
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.startsWith('Error while running "equal" command: Failed [equal]: (0 == 1)'));
          assert.strictEqual(typeof results.modules.sampleWithAssertionFailedInAfter, 'object');
          assert.strictEqual(results.modules.sampleWithAssertionFailedInAfter.assertionsCount, 1);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInAfter.errmessages.length, 1);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInAfter.failedCount, 1);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInAfter.skipped.length, 0);
          assert.strictEqual(results.modules.sampleWithAssertionFailedInAfter.completed.demoTestAsyncOne.assertions.length, 0);
        }
      },
      output: false,
      screenshots: {
        enabled: false
      }
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readFilePromise('output/FIREFOX_TEST_TEST_sampleWithAssertionFailedInAfter.xml');
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.includes('<system-err>'), 'Report should contain <system-err>');
        assert.ok(content.includes('Failed [equal]: (0 == 1) - expected &#34;1&#34; but got: &#34;0&#34;'), 'Report should contain Failed [equal]: (0 == 1)');
        assert.ok(content.indexOf('sampleWithAssertionFailedInAfter.js') > -1, 'Report should contain stack trace');
      });
  });

  it('testRun with jUnit output and failures in testcase and after hook', function () {
    let testsPath = [
      path.join(__dirname, '../../asynchookstests/sampleWithFailureInTestcaseAndAfter.js')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter: function (results) {
          assert.strictEqual(results.assertions, 2);
          assert.strictEqual(results.errmessages.length, 1);
          assert.strictEqual(results.failed, 2);
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.startsWith('Error while running "strictEqual" command: Failed [strictEqual]:'));
          assert.strictEqual(typeof results.modules.sampleWithFailureInTestcaseAndAfter, 'object');
          assert.strictEqual(results.modules.sampleWithFailureInTestcaseAndAfter.assertionsCount, 2);
          assert.strictEqual(results.modules.sampleWithFailureInTestcaseAndAfter.errmessages.length, 1);
          assert.strictEqual(results.modules.sampleWithFailureInTestcaseAndAfter.failedCount, 2);
          assert.strictEqual(results.modules.sampleWithFailureInTestcaseAndAfter.skipped.length, 0);
          assert.strictEqual(results.modules.sampleWithFailureInTestcaseAndAfter.completed['demo test async'].assertions.length, 1);

        }
      },
      output: false,
      screenshots: {
        enabled: false
      }
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readFilePromise('output/FIREFOX_TEST_TEST_sampleWithFailureInTestcaseAndAfter.xml');
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.includes('<system-err>'), 'Report should contain <system-err>');
        assert.ok(content.includes('<failure message="Failed [equal]: (0 == 1) - expected &#34;1&#34; but got: &#34;0&#34;'), 'Report should contain Failed [equal]: (0 == 1)');
        assert.ok(content.includes('Failed [strictEqual]: '), 'Report should contain Failed [strictEqual]');
        assert.ok(content.indexOf('sampleWithFailureInTestcaseAndAfter.js') > -1, 'Report should contain stack trace');
      });
  });

  it('testRun with jUnit output and errors in testcase and failure in after hook', function () {
    let testsPath = [
      path.join(__dirname, '../../asynchookstests/sampleWithErrorInTestcaseAndAfter.js')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter: function (results) {
          assert.strictEqual(results.assertions, 1);
          assert.strictEqual(results.errmessages.length, 2);
          assert.strictEqual(results.failed, 1);
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.startsWith('Error while running "strictEqual" command: Failed [strictEqual]:'));
          assert.strictEqual(typeof results.modules.sampleWithErrorInTestcaseAndAfter, 'object');
          assert.strictEqual(results.modules.sampleWithErrorInTestcaseAndAfter.assertionsCount, 1);
          assert.strictEqual(results.modules.sampleWithErrorInTestcaseAndAfter.errmessages.length, 2);
          assert.strictEqual(results.modules.sampleWithErrorInTestcaseAndAfter.failedCount, 1);
          assert.strictEqual(results.modules.sampleWithErrorInTestcaseAndAfter.skipped.length, 0);
          assert.strictEqual(results.modules.sampleWithErrorInTestcaseAndAfter.completed['demo test async'].assertions.length, 0);
          assert.strictEqual(results.modules.sampleWithErrorInTestcaseAndAfter.completed['demo test async'].errors, 1);
          assert.ok(results.modules.sampleWithErrorInTestcaseAndAfter.completed['demo test async'].lastError instanceof Error);
          assert.strictEqual(results.modules.sampleWithErrorInTestcaseAndAfter.completed['demo test async'].lastError.message, 'error in testcase');
        }
      },
      output: false,
      screenshots: {
        enabled: false
      }
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readFilePromise('output/FIREFOX_TEST_TEST_sampleWithErrorInTestcaseAndAfter.xml');
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.includes('<system-err>'), 'Report should contain <system-err>');
        assert.ok(content.includes('<error message="error in testcase" type="error">'), 'Report should contain <error>');
        assert.ok(content.includes('Failed [strictEqual]:'), 'Report should contain Failed [strictEqual]');
        assert.ok(content.indexOf('sampleWithErrorInTestcaseAndAfter.js') > -1, 'Report should contain stack trace');
      });
  });

  it('testRun with jUnit output and failures in before and after hook', function () {
    let testsPath = [
      path.join(__dirname, '../../asynchookstests/sampleWithFailureInBeforeAndAfter.js')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: false,
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter: function (results) {
          assert.strictEqual(results.assertions, 2);
          assert.strictEqual(results.errmessages.length, 2);
          assert.strictEqual(results.failed, 2);
          assert.ok(results.lastError instanceof Error);
          assert.strictEqual(typeof results.modules.sampleWithFailureInBeforeAndAfter, 'object');
          assert.strictEqual(results.modules.sampleWithFailureInBeforeAndAfter.assertionsCount, 2);
          assert.strictEqual(results.modules.sampleWithFailureInBeforeAndAfter.errmessages.length, 2);
          assert.strictEqual(results.modules.sampleWithFailureInBeforeAndAfter.failedCount, 2);
          assert.strictEqual(results.modules.sampleWithFailureInBeforeAndAfter.skipped.length, 0);
        }
      },
      output: false,
      screenshots: {
        enabled: false
      }
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readFilePromise('output/FIREFOX_TEST_TEST_sampleWithFailureInBeforeAndAfter.xml');
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.includes('<system-err>'), 'Report should contain <system-err>');
        assert.ok(content.includes('Failed [equal]: (0 == 1)'), 'Report should contain Failed [equal]: (0 == 1)');
        assert.ok(content.includes('Failed [strictEqual]'), 'Report should contain Failed [strictEqual]');
        assert.ok(content.includes('sampleWithFailureInBeforeAndAfter.js'), 'Report should contain stack trace');
      });
  });

  it('testRunWithJUnitOutput', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/withsubfolders')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: true,
      globals: {reporter: function() {}},
      output: false
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readDirPromise(testsPath[0]);
      })
      .then(list => {
        let simpleReportFile = 'output/simple/FIREFOX_TEST_TEST_sample.xml';
        let tagsReportFile = 'output/tags/FIREFOX_TEST_TEST_sampleTags.xml';

        assert.deepEqual(list, ['simple', 'tags'], 'The subfolders have not been created.');
        assert.ok(fileExistsSync(simpleReportFile), 'The simple report file was not created.');
        assert.ok(fileExistsSync(tagsReportFile), 'The tags report file was not created.');

        return readFilePromise(simpleReportFile);
      })
      .then(data => {
        let content = data.toString();
        assert.ok(/<testsuite[\s]+name="simple\.sample"[\s]+errors="0"[\s]+failures="0"[\s]+hostname=""[\s]+id=""[\s]+package="simple"[\s]+skipped="0"[\s]+tests="1"/.test(content),
          'Report does not contain correct testsuite information.');

        assert.ok(/<testcase[\s]+name="simpleDemoTest"[\s]+classname="simple\.sample"[\s]+time="[.\d]+"[\s]+assertions="1">/.test(content),
          'Report does not contain the correct testcase element.');
      });
  });
});

function readFilePromise(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(err, result) {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
}

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

// util to replace deprecated fs.existsSync
function fileExistsSync(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}
