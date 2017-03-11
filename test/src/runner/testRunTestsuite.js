var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var Runner = common.require('runner/run.js');

module.exports = {
  'testRunTestsuite' : {
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

    afterEach: function () {
      Object.keys(require.cache).forEach(function(module) {
        delete require.cache[module];
      });
    },

    testRunSuiteRetries : function(done) {
      var testsPath = path.join(__dirname, '../../sampletests/withfailures');
      var globals = {
        calls : 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        persist_globals : true,
        globals : globals
      }, {
        output_folder : false,
        start_session : true,
        suite_retries: 1
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 8);
        assert.deepEqual(results.errmessages, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 1);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunSuiteRetriesNoSkipTestcasesOnFail : function(done) {
      var testsPath = path.join(__dirname, '../../sampletests/withfailures');
      var globals = {
        calls : 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        persist_globals : true,
        globals : globals,
        skip_testcases_on_fail: false
      }, {
        output_folder : false,
        start_session : true,
        suite_retries: 1
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 10);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunSuiteRetriesWithLocateStrategy : function(done) {
      var testsPath = path.join(__dirname, '../../sampletests/suiteretries/locate-strategy');
      var globals = {
        calls : 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        persist_globals : true,
        globals : globals,
        skip_testcases_on_fail: false
      }, {
        output_folder : false,
        start_session : true,
        suite_retries: 1
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.equal(runner.currentTestSuite.client['@client'].locateStrategy, 'css selector');
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test clear command queue when run with suiteRetries' : function(done) {
      var testsPath = path.join(__dirname, '../../sampletests/suiteretries/sample');
      var globals = {
        calls : 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        persist_globals : true,
        globals : globals
      }, {
        output_folder : false,
        start_session : true,
        suite_retries: 1
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 3);
        assert.equal(results.passed, 3);

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunModuleSyncName : function(done) {
      var globals = {
        calls : 0
      };
      var testsPath = path.join(__dirname, '../../sampletests/syncnames');
      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        sync_test_names : true,
        persist_globals : true,
        globals : globals
      }, {
        output_folder : false,
        start_session : true
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.ok('sampleTest' in results.modules);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test run multiple sources and same module name' : function(done) {
      var srcFolders = [
        path.join(__dirname, '../../sampletests/simple'),
        path.join(__dirname, '../../sampletests/mixed')
      ];

      var runner = new Runner(srcFolders, {
        seleniumPort : 10195,
        silent : true,
        output : false,
        globals : {
        }
      }, {
        output_folder : false,
        start_session : true,
        src_folders : srcFolders
      }, function(err, results) {
        if (err) {
          throw err;
        }

        assert.ok('simple/sample' in results.modules);
        assert.ok('mixed/sample' in results.modules);
        assert.ok('demoTest' in results.modules['simple/sample'].completed);
        assert.ok('demoTestMixed' in results.modules['mixed/sample'].completed);

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunMultipleSrcFolders : function(done) {
      var srcFolders = [
        path.join(__dirname, '../../sampletests/simple'),
        path.join(__dirname, '../../sampletests/srcfolders')
      ];
      var runner = new Runner(srcFolders, {
        seleniumPort : 10195,
        silent : true,
        output : false
      }, {
        output_folder : false,
        start_session : true,
        src_folders : srcFolders
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.ok('simple/sample' in results.modules);
        assert.ok('demoTest' in results.modules['simple/sample'].completed);
        assert.ok('srcfolders/other_sample' in results.modules);
        assert.ok('srcFoldersTest' in results.modules['srcfolders/other_sample'].completed);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    }
  }
};
