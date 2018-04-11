const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');

describe('testRunnerUnitTests', function() {
  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
  });

  it('testRunUnitTests', function() {
    let src_folders = path.join(__dirname, '../../sampletests/unittests');

    let settings = Settings.parse({
      output_folder: 'output',
      unit_tests_mode: true
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(src_folders, settings)
      .then(modules => {
        return runner.run(modules);
      });
  });

  it('test run unit tests with junit output and failures', function() {
    let src_folders = [
      path.join(__dirname, '../../asynchookstests/unittest-failure')
    ];

    let settings = Settings.parse({
      output_folder: 'output',
      unit_tests_mode: true
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(src_folders, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        let sampleReportFile = 'output/unittest-failure.xml';
        assert.ok(fileExistsSync(sampleReportFile), 'The sample file report was not created.');

        return readFilePromise(sampleReportFile);
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.indexOf('<failure message="AssertionError: 1 == 0 - expected &#34;0&#34; but got: &#34;1&#34;">') > 0, 'Report contains failure information.')
      });
  });

  it('test async unit test with timeout error', function() {
    let testsPath = path.join(__dirname, '../../asynchookstests/unittest-async-timeout.js');

    let settings = Settings.parse({
      output_folder: 'output',
      unit_tests_mode: true,
      persist_globals: true,
      globals: {
        calls: 0,
        asyncHookTimeout: 10
      }
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(hasFailed => {
        assert.ok(hasFailed);

        let err = runner.results.lastError;
        assert.ok(err instanceof Error);
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
