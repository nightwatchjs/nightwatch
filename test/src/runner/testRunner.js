var path = require('path');
var fs = require('fs');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var Runner = common.require('runner/run.js');

module.exports = {
  'testRunner': {
    before: function (done) {
      CommandGlobals.beforeEach.call(this, done);
    },

    after: function (done) {
      CommandGlobals.afterEach.call(this, done);
    },

    beforeEach: function () {
      process.removeAllListeners('exit');
      process.removeAllListeners('uncaughtException');
    },

    testRunEmptyFolder : function(done) {
      var testsPath = path.join(__dirname, '../../sampletests/empty');
      var runner = new Runner([testsPath], {}, {
        output_folder : false
      }, function(err) {
        assert.strictEqual(err.message.indexOf('No tests defined!'), 0);
        done();
      });
      runner.run();
    },

    testRunNoSrcFoldersArgument : function(done) {
      var runner = new Runner(undefined, {}, {
        output_folder : false
      });
      try {
        runner.run().catch(function(err) {
          done(err);
        });
      } catch (ex) {
        assert.ok(ex instanceof Error);
        assert.equal(ex.message, 'No source folder defined. Check configuration.');
        done();
      }
    },

    testRunSimple: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/simple');
      var globals = {
        calls: 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: globals
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.strictEqual(err, null);
        assert.ok('sample' in results.modules);
        assert.ok('demoTest' in results.modules.sample.completed);
        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    testRunWithJUnitOutput : function(done) {
      var src_folders = [
        path.join(__dirname, '../../sampletests/withsubfolders')
      ];
      var currentTestArray = [];

      var runner = new Runner(src_folders, {
        seleniumPort : 10195,
        silent : true,
        output : false,
        globals : {
          beforeEach : function(client, doneFn) {
            currentTestArray.push({
              name : client.currentTest.name,
              module : client.currentTest.module,
              group : client.currentTest.group
            });
            doneFn();
          }
        }
      }, {
        output_folder : 'output',
        start_session : true,
        src_folders : src_folders,
        reporter : 'junit'
      }, function(err, results) {

        assert.strictEqual(err, null);
        assert.deepEqual(currentTestArray, [
          { name: '', module: 'simple/sample', group : 'simple' },
          { name: '', module: 'tags/sampleTags', group : 'tags' }
        ]);

        fs.readdir(src_folders[0], function(err, list) {
          try {
            assert.deepEqual(list, ['simple', 'tags'], 'The subfolders have been created.');
            var simpleReportFile = 'output/simple/FIREFOX_TEST_TEST_sample.xml';
            var tagsReportFile = 'output/tags/FIREFOX_TEST_TEST_sampleTags.xml';

            assert.ok(fileExistsSync(simpleReportFile), 'The simple report file was not created.');
            assert.ok(fileExistsSync(tagsReportFile), 'The tags report file was not created.');

            fs.readFile(simpleReportFile, function(err, data) {
              if (err) {
                return done(err);
              }

              var content = data.toString();
              try {
                assert.ok(/<testsuite[\s]+name="simple\.sample"[\s]+errors="0"[\s]+failures="0"[\s]+hostname=""[\s]+id=""[\s]+package="simple"[\s]+skipped="0"[\s]+tests="1"/.test(content), 'Report does not contain correct testsuite information.');
                assert.ok(/<testcase[\s]+name="simpleDemoTest"[\s]+classname="simple\.sample"[\s]+time="[.\d]+"[\s]+assertions="1">/.test(content), 'Report does not contain the correct testcase element.');
                done();
              } catch (err) {
                done(err);
              }
            });
          } catch (err) {
            done(err);
          }
        });
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    testRunWithJUnitOutputAndFailures : function(done) {
      var src_folders = [
        path.join(__dirname, '../../sampletests/withfailures')
      ];

      var runner = new Runner(src_folders, {
        seleniumPort : 10195,
        silent : true,
        output : false
      }, {
        output_folder : 'output',
        start_session : true,
        src_folders : src_folders,
        reporter : 'junit'
      }, function(err, results) {

        assert.strictEqual(err, null);
        var sampleReportFile = path.join(__dirname, '../../../output/FIREFOX_TEST_TEST_sample.xml');

        assert.ok(fileExistsSync(sampleReportFile), 'The sample file report file was not created.');
        fs.readFile(sampleReportFile, function(err, data) {
          if (err) {
            done(err);
            return;
          }
          var content = data.toString();
          assert.ok(content.indexOf('<failure message="Testing if element &lt;#badElement&gt; is present.">') > 0, 'Report contains failure information.')
          done();
        });
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    'test run unit tests with junit output and failures' : function(done) {
      var src_folders = [
        path.join(__dirname, '../../asynchookstests/unittest-failure')
      ];

      var runner = new Runner(src_folders, {
        seleniumPort : 10195,
        silent : true,
        output : false
      }, {
        output_folder : 'output',
        start_session : false,
        src_folders : src_folders,
        reporter : 'junit'
      }, function(err, results) {

        assert.strictEqual(err, null);
        var sampleReportFile = path.join(__dirname, '../../../output/unittest-failure.xml');

        assert.ok(fileExistsSync(sampleReportFile), 'The sample file report file was not created.');
        fs.readFile(sampleReportFile, function(err, data) {
          if (err) {
            done(err);
            return;
          }
          var content = data.toString();
          try {
            assert.ok(content.indexOf('<failure message="AssertionError: 1 == 0 - expected &quot;0&quot; but got: &quot;1&quot;">') > 0, 'Report contains failure information.')
            done();
          } catch (err) {
            done(err);
          }
        });
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    testRunUnitTests : function(done) {
      var testsPath = path.join(__dirname, '../../sampletests/unittests');

      var runner = new Runner([testsPath], {
        silent : true,
        output : false,
        globals : {}
      }, {
        output_folder : false,
        start_session : false
      }, function(err, results) {
        assert.strictEqual(err, null);

        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    'test async unit test with timeout error': function (done) {
      var testsPath = path.join(__dirname, '../../asynchookstests/unittest-async-timeout.js');
      var globals = {
        calls : 0,
        asyncHookTimeout: 10
      };

      process.on('uncaughtException', function (err) {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'done() callback timeout of 10 ms was reached while executing "demoTest". ' +
          'Make sure to call the done() callback when the operation finishes.');

        done();
      });

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        seleniumHost: '127.0.0.1',
        silent: true,
        output: false,
        persist_globals : true,
        globals: globals,
        compatible_testcase_support : true
      }, {
        output_folder : false,
        start_session : false
      });

      runner.run().catch(function(err) {
        done(err);
      });
    }
  }
};


// util to replace deprecated fs.existsSync
function fileExistsSync (path) {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}
