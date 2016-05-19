var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');

module.exports = {
  'testRunTestcase' : {

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

    testRunNoSkipTestcasesOnFail : function(done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/withfailures');
      var globals = {
        calls : 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        skip_testcases_on_fail: false,
        persist_globals : true,
        globals : globals
      }, {
        output_folder : false,
        start_session : true
      }, function(err, results) {
        assert.strictEqual(err, null);
        assert.equal(globals.calls, 6);
        assert.equal(results.passed, 2);
        assert.equal(results.failed, 2);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunSkipTestcasesOnFail : function(done) {
      var Runner = common.require('runner/run.js');
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
        start_session : true
      }, function(err, results) {
        assert.strictEqual(err, null);
        assert.equal(globals.calls, 4);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 1);
        assert.equal(results.errors, 0);
        assert.equal(results.modules.sample.skipped[0], 'demoTest2');

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunTestcase : function(done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
      var runner = new Runner(testsPath, {
        silent : true,
        output : false,
        globals : {
        }
      }, {
        output_folder : false,
        start_session : true,
        testcase : 'demoTestSyncOne'
      }, function(err, results) {
        if (err) {
          throw err;
        }

        assert.ok('demoTestSyncOne' in results.modules.syncBeforeAndAfter.completed);
        assert.ok(!('demoTestSyncTwo' in results.modules.syncBeforeAndAfter.completed));

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunTestcaseInvalid : function(done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');

      var runner = new Runner(testsPath, {
        silent : true,
        output : false,
        globals : {
        }
      }, {
        output_folder : false,
        start_session : true,
        testcase : 'Unknown'
      }, function(err, results) {
        assert.equal(err.message, 'Error: "Unknown" is not a valid testcase in the current test suite.');

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunCurrentTestName : function(done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js');
      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        globals : {
          beforeEach: function(client, cb) {
            assert.equal(client.currentTest.name, '');
            assert.equal(client.currentTest.group, '');
            assert.equal(client.currentTest.module, 'sampleSingleTest');
            cb();
          },
          afterEach: function(client, cb) {
            assert.equal(client.currentTest.name, null);
            assert.equal(client.currentTest.module, 'sampleSingleTest');
            cb();
          }
        }
      }, {
        output_folder : false,
        start_session : true
      }, function(err, results) {
        if (err) {
          throw err;
        }

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunCurrentTestInAfterEach : function(done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/withaftereach/sampleSingleTest.js');
      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        globals : {
        }
      }, {
        output_folder : false,
        start_session : true
      }, function(err, results) {
        if (err) {
          throw err;
        }
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunRetries : function(done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/withfailures');
      var globals = {calls : 0};

      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        globals : globals,
        persist_globals : true
      }, {
        output_folder : false,
        start_session : true,
        retries: 1
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 6);
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

    testRunRetriesNoSkipTestcasesOnFail : function(done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/withfailures');
      var globals = {calls : 0};

      var runner = new Runner([testsPath], {
        seleniumPort : 10195,
        silent : true,
        output : false,
        globals : globals,
        skip_testcases_on_fail: false,
        persist_globals : true
      }, {
        output_folder : false,
        start_session : true,
        retries: 1
      }, function(err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 10);
        assert.equal(results.passed, 2);
        assert.equal(results.failed, 2);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    }
  }


};
