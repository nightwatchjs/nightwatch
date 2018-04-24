const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const Globals = require('../../lib/globals.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');

describe('testRunner', function() {
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
  });

  it('testRunEmptyFolder', function() {
    let testsPath = path.join(__dirname, '../../sampletests/empty');

    return Globals.startTestRunner(testsPath, {
      output_folder: false
    })
      .catch(err => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, `No tests defined! using source folder: ${testsPath}`);
      });
  });

  it('testRunNoSrcFoldersArgument', function() {
    let settings = Settings.parse({
      output_folder: false
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    assert.throws(function() {
      return Runner.readTestSource()
        .then(modules => {
          return runner.run(modules);
        });
    }, /No test source specified and no source folder defined\. Check configuration\./)
  });

  it('testRunSimple', function() {
    let testsPath = path.join(__dirname, '../../sampletests/simple');

    let globals = {
      calls: 0
    };

    return Globals.startTestRunner(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: false,
      globals: globals
    })
      .then(runner => {
        assert.ok('sample' in runner.results.modules);
        assert.ok('demoTest' in runner.results.modules.sample.completed);

        if (runner.results.lastError) {
          throw runner.results.lastError;
        }
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
      output: false
    };

    return Globals.startTestRunner(testsPath, settings)
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
        assert.ok(/<testsuite[\s]+name="simple\.sample"[\s]+errors="0"[\s]+failures="0"[\s]+hostname=""[\s]+id=""[\s]+package="sample"[\s]+skipped="0"[\s]+tests="1"/.test(content), 'Report does not contain correct testsuite information.');
        assert.ok(/<testcase[\s]+name="simpleDemoTest"[\s]+classname="simple\.sample"[\s]+time="[.\d]+"[\s]+assertions="1">/.test(content), 'Report does not contain the correct testcase element.');
      });
  });

  it('testRunWithJUnitOutputAndFailures', function() {
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
      silent: true,
      output: false,
    };

    return Globals.startTestRunner(testsPath, settings)
      .then(_ => {
        return readDirPromise(testsPath[0]);
      })
      .then(list => {
        let sampleReportFile = 'output/FIREFOX_TEST_TEST_sample.xml';
        assert.ok(fileExistsSync(sampleReportFile), 'The sample file report was not created.');

        return readFilePromise(sampleReportFile);
      })
      .then(data => {
        let content = data.toString();
        assert.ok(content.indexOf('<failure message="Testing if element &lt;#badElement&gt; is present.') > 0, 'Report contains failure information.')
      });
  });

  it('test run unit tests with junit output and failures', function() {
    let testsPath = [
      path.join(__dirname, '../../asynchookstests/unittest-failure')
    ];

    let settings = {
      output_folder: 'output',
      silent: true,
      output: false,
      unit_tests_mode: true,
    };

    return Globals.startTestRunner(testsPath, settings)
      .then(_ => {
        return readDirPromise(testsPath[0]);
      })
      .then(list => {

        let sampleReportFile = 'output/unittest-failure.xml';
        assert.ok(fileExistsSync(sampleReportFile), 'The sample file report was not created.');

        return readFilePromise(sampleReportFile);
      })
      .then(data => {
        let content = data.toString();
        console.log(content);
        assert.ok(content.indexOf('<failure message="AssertionError: 1 == 0 - expected &#34;0&#34; but got: &#34;1&#34;">') > 0, 'Report contains failure information.')
      });
  });

  it('testRunUnitTests', function() {
    let testsPath = path.join(__dirname, '../../sampletests/unittests');

    let settings = {
      output_folder: false,
      silent: true,
      output: false,
      unit_tests_mode: true
    };

    return Globals.startTestRunner(testsPath, settings)
      .then(_ => {
        return readDirPromise(testsPath[0]);
      })
      .then(list => {

        console.log(list);
      });
  })
  ;

  it('test async unit test with timeout error', function() {
    let testsPath = path.join(__dirname, '../../asynchookstests/unittest-async-timeout.js');
    let globals = {
      calls: 0,
      asyncHookTimeout: 10
    };

    process.on('uncaughtException', function(err) {
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'done() callback timeout of 10 ms was reached while executing "demoTest". ' +
        'Make sure to call the done() callback when the operation finishes.');

      done();
    });

    // let runner = new Runner([testsPath], {
    //   seleniumPort: 10195,
    //   seleniumHost: '127.0.0.1',
    //   silent: true,
    //   output: false,
    //   persist_globals: true,
    //   globals: globals,
    //   compatible_testcase_support: true
    // }, {
    //   output_folder: false,
    //   start_session: false
    // });
    //
    // runner.run().catch(function(err) {
    //   done(err);
    // });
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
