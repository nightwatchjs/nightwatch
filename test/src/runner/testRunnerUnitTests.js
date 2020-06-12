const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');
const NightwatchClient = common.require('index.js');

describe('testRunnerUnitTests', function() {
  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRunUnitTests', function() {
    let testsPath = path.join(__dirname, '../../sampletests/unittests');

    return NightwatchClient.runTests(testsPath, {
      output_folder: false,
      unit_tests_mode: true,
      output: false,
      globals: {
        reporter(results) {
          if (results.lastError) {
            throw results.lastError;
          }
        }
      }
    });
  });

  it('testRunner unit tests with annotation', function() {
    let testsPath = path.join(__dirname, '../../sampletests/unittests/sampleAnnotation.js');

    const settings = {
      output_folder: false,
      output: false,
      persist_globals: true,
      globals: {
        calls: 0,
        reporter(results) {
          if (results.lastError) {
            throw results.lastError;
          }

          assert.equal(settings.globals.calls, 2);
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner unit tests with annotation and describe', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withdescribe/unittests/');

    const settings = {
      output_folder: false,
      output: false,
      persist_globals: true,
      globals: {
        calls: 0,
        reporter(results) {
          if (results.lastError) {
            throw results.lastError;
          }

          assert.equal(settings.globals.calls, 2);
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner unit tests with annotation and error thrown', function() {
    let testsPath = path.join(__dirname, '../../asynchookstests/unittest-error.js');

    const settings = {
      output_folder: false,
      output: false,
      globals: {
        reporter(results) {
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.includes('There is already a .client property defined in'));
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test run unit tests with junit output and failures', function() {
    let testsPath = [
      path.join(__dirname, '../../asynchookstests/unittest-failure')
    ];

    return NightwatchClient
      .runTests(testsPath, {
        output_folder: 'output',
        unit_tests_mode: true,
        output: false,
        globals: {
          reporter(results) {
            assert.strictEqual(results.passed, 0);
            assert.strictEqual(results.failed, 1);
            assert.strictEqual(results.errors, 0);
            assert.strictEqual(results.assertions, 1);
            assert.strictEqual(results.errmessages.length, 0);
            assert.ok(results.lastError instanceof Error);
            assert.strictEqual(results.lastError.name, 'AssertionError [ERR_ASSERTION]');
            assert.ok(results.modules['unittest-failure'].lastError instanceof Error);
            assert.strictEqual(results.modules['unittest-failure'].lastError.name, 'AssertionError [ERR_ASSERTION]');
            assert.strictEqual(results.modules['unittest-failure'].assertionsCount, 1);
            assert.strictEqual(results.modules['unittest-failure'].testsCount, 1);
            assert.strictEqual(results.modules['unittest-failure'].failedCount, 1);
            assert.strictEqual(results.modules['unittest-failure'].errorsCount, 0);
            assert.strictEqual(results.modules['unittest-failure'].passedCount, 0);
            assert.strictEqual(results.modules['unittest-failure'].completed.demoTest.assertions.length, 1);

            const {completed} = results.modules['unittest-failure'];
            const {assertions} = completed.demoTest;
            assert.strictEqual(completed.demoTest.failed, 1);
            assert.ok(completed.demoTest.stackTrace.startsWith('AssertionError [ERR_ASSERTION]: 1 == 0 - expected "0" but got: "1"'));
            assert.strictEqual(assertions[0].failure, 'expected "0" but got: "1"');
            assert.strictEqual(assertions[0].fullMsg, '1 == 0 - expected "0" but got: "1"');
            assert.strictEqual(assertions[0].message, '1 == 0 - expected "0" but got: "1"');
            assert.ok(assertions[0].stackTrace.startsWith, 'AssertionError [ERR_ASSERTION]: 1 == 0 - expected "0" but got: "1"');
          }
        }
      })
      .then(runner => {
        let sampleReportFile = 'output/unittest-failure.xml';
        assert.ok(fileExistsSync(sampleReportFile), 'The sample file report was not created.');

        return readFilePromise(sampleReportFile);
      })
      .then(data => {
        let content = data.toString();

        assert.ok(content.includes('<failure message="1 == 0 - expected &#34;0&#34; but got: &#34;1&#34;">'), 'Report does not contain failure information.');
      });
  });

  it('test async unit test with timeout error', function() {
    let testsPath = path.join(__dirname, '../../asynchookstests/unittest-async-timeout.js');

    let settings = Settings.parse({
      output_folder: 'output',
      unit_tests_mode: true,
      persist_globals: true,
      output: false,
      globals: {
        calls: 0,
        unitTestsTimeout: 10,
        reporter() {}
      }
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(settings, {
      _source: [testsPath]
    })
      .then(modules => {
        return runner.run(modules);
      })
      .then(hasFailed => {
        assert.ok(hasFailed);

        let err = runner.results.lastError;
        assert.ok(err instanceof Error);
        assert.ok(fileExistsSync('output/unittest-async-timeout.xml'));
        assert.equal(err.name, 'TimeoutError');
        assert.equal(err.message, 'done() callback timeout of 10ms was reached while executing "demoTest". ' +
        'Make sure to call the done() callback when the operation finishes.');
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

// util to replace deprecated fs.existsSync
function fileExistsSync(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}
