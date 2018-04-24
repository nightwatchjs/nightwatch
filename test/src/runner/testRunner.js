const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
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

    let settings = Settings.parse({
      output_folder: false
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
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

    try {
      return Runner.readTestSource(undefined, settings)
        .then(modules => {
          return runner.run(modules);
        });
    } catch (ex) {
      assert.ok(ex instanceof Error);
      assert.equal(ex.message, 'Cannot read property \'length\' of undefined');
    }
  });

  it('testRunSimple', function() {
    let testsPath = path.join(__dirname, '../../sampletests/simple');

    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: false,
      silent: true,
      output: false,
      globals: globals
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(result => {
        assert.ok('sample' in runner.results.modules);
        assert.ok('demoTest' in runner.results.modules.sample.completed);

        if (runner.results.lastError) {
          throw runner.results.lastError;
        }
      });
  });

  it('testRunWithJUnitOutput', function() {

    let src_folders = [
      path.join(__dirname, '../../sampletests/withsubfolders')
    ];

    let currentTestArray = [];

    let globals = {
      beforeEach: function(client, doneFn) {
        currentTestArray.push({
          name: client.currentTest.name,
          module: client.currentTest.module,
          group: client.currentTest.group
        });
        doneFn();
      }
    };

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      // src_folders: src_folders,
      silent: true,
      output: false,
      globals: globals
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(src_folders, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.deepEqual(currentTestArray, [
          {name: '', module: 'simple/sample', group: 'simple'},
          {name: '', module: 'tags/sampleTags', group: 'tags'}
        ]);
      });

    // let src_folders = [
    //   path.join(__dirname, '../../sampletests/withsubfolders')
    // ];
    // let currentTestArray = [];
    //
    // let runner = new Runner(src_folders, {
    //   seleniumPort: 10195,
    //   silent: true,
    //   output: false,
    //   globals: {
    //     beforeEach: function(client, doneFn) {
    //       currentTestArray.push({
    //         name: client.currentTest.name,
    //         module: client.currentTest.module,
    //         group: client.currentTest.group
    //       });
    //       doneFn();
    //     }
    //   }
    // }, {
    //   output_folder: 'output',
    //   start_session: true,
    //   src_folders: src_folders,
    //   reporter: 'junit'
    // }, function(err, results) {
    //
    //   assert.strictEqual(err, null);
    //   assert.deepEqual(currentTestArray, [
    //     {name: '', module: 'simple/sample', group: 'simple'},
    //     {name: '', module: 'tags/sampleTags', group: 'tags'}
    //   ]);
    //
    //   fs.readdir(src_folders[0], function(err, list) {
    //     try {
    //       assert.deepEqual(list, ['simple', 'tags'], 'The subfolders have been created.');
    //       let simpleReportFile = 'output/simple/FIREFOX_TEST_TEST_sample.xml';
    //       let tagsReportFile = 'output/tags/FIREFOX_TEST_TEST_sampleTags.xml';
    //
    //       assert.ok(fileExistsSync(simpleReportFile), 'The simple report file was not created.');
    //       assert.ok(fileExistsSync(tagsReportFile), 'The tags report file was not created.');
    //
    //       fs.readFile(simpleReportFile, function(err, data) {
    //         if (err) {
    //           return done(err);
    //         }
    //
    //         let content = data.toString();
    //         try {
    //           assert.ok(/<testsuite[\s]+name="simple\.sample"[\s]+errors="0"[\s]+failures="0"[\s]+hostname=""[\s]+id=""[\s]+package="simple"[\s]+skipped="0"[\s]+tests="1"/.test(content), 'Report does not contain correct testsuite information.');
    //           assert.ok(/<testcase[\s]+name="simpleDemoTest"[\s]+classname="simple\.sample"[\s]+time="[.\d]+"[\s]+assertions="1">/.test(content), 'Report does not contain the correct testcase element.');
    //           done();
    //         } catch (err) {
    //           done(err);
    //         }
    //       });
    //     } catch (err) {
    //       done(err);
    //     }
    //   });
    // });
    //
    // runner.run().catch(function(err) {
    //   done(err);
    // });
  });

  it('testRunWithJUnitOutputAndFailures', function() {
    let src_folders = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    let runner = new Runner(src_folders, {
      seleniumPort: 10195,
      silent: true,
      output: false
    }, {
      output_folder: 'output',
      start_session: true,
      src_folders: src_folders,
      reporter: 'junit'
    }, function(err, results) {

      assert.strictEqual(err, null);
      let sampleReportFile = path.join(__dirname, '../../../output/FIREFOX_TEST_TEST_sample.xml');

      assert.ok(fileExistsSync(sampleReportFile), 'The sample file report file was not created.');
      fs.readFile(sampleReportFile, function(err, data) {
        if (err) {
          done(err);
          return;
        }
        let content = data.toString();
        assert.ok(content.indexOf('<failure message="Testing if element &lt;#badElement&gt; is present.">') > 0, 'Report contains failure information.')
        done();
      });
    });

    runner.run().catch(function(err) {
      done(err);
    });
  });

  it('test run unit tests with junit output and failures', function() {
    let src_folders = [
      path.join(__dirname, '../../asynchookstests/unittest-failure')
    ];

    let runner = new Runner(src_folders, {
      seleniumPort: 10195,
      silent: true,
      output: false
    }, {
      output_folder: 'output',
      start_session: false,
      src_folders: src_folders,
      reporter: 'junit'
    }, function(err, results) {

      assert.strictEqual(err, null);
      let sampleReportFile = path.join(__dirname, '../../../output/unittest-failure.xml');

      assert.ok(fileExistsSync(sampleReportFile), 'The sample file report file was not created.');
      fs.readFile(sampleReportFile, function(err, data) {
        if (err) {
          done(err);
          return;
        }
        let content = data.toString();
        try {
          assert.ok(content.indexOf('<failure message="AssertionError: 1 == 0 - expected &#34;0&#34; but got: &#34;1&#34;">') > 0, 'Report contains failure information.')
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    runner.run().catch(function(err) {
      done(err);
    });
  });

  it('testRunUnitTests', function() {
    let testsPath = path.join(__dirname, '../../sampletests/unittests');

    let runner = new Runner([testsPath], {
      silent: true,
      output: false,
      globals: {}
    }, {
      output_folder: false,
      start_session: false
    }, function(err, results) {
      assert.strictEqual(err, null);

      done();
    });

    runner.run().catch(function(err) {
      done(err);
    });
  });

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

    let runner = new Runner([testsPath], {
      seleniumPort: 10195,
      seleniumHost: '127.0.0.1',
      silent: true,
      output: false,
      persist_globals: true,
      globals: globals,
      compatible_testcase_support: true
    }, {
      output_folder: false,
      start_session: false
    });

    runner.run().catch(function(err) {
      done(err);
    });
  });
});

// util to replace deprecated fs.existsSync
function fileExistsSync(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}
