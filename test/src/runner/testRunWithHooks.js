var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var Runner = common.require('runner/run.js');

module.exports = {
  'testRunWithHooks' : {
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

    'test run with async setUp and tearDown': function (done) {
      var globals = {
        calls : 0
      };
      var testsPath = path.join(__dirname, '../../sampletests/async');
      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals: globals
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 2);
        assert.ok('sample' in results.modules);
        assert.ok('demoTestAsync' in results.modules.sample.completed);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test run with async tearDown': function (done) {
      var globals = {
        calls : 0
      };
      var testsPath = path.join(__dirname, '../../sampletests/mixed');
      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals: globals
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.ok('sample' in results.modules);
        assert.ok('demoTestMixed' in results.modules.sample.completed);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunAsyncWithBeforeAndAfter: function (done) {
      var globals = {
        calls : 0
      };
      var testsPath = path.join(__dirname, '../../sampletests/before-after');
      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals: globals
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 17);
        assert.ok('sampleWithBeforeAndAfter' in results.modules);

        var result = results.modules.sampleWithBeforeAndAfter.completed;
        assert.ok('demoTestAsyncOne' in result);
        assert.ok('demoTestAsyncTwo' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
        assert.ok('syncBeforeAndAfter' in results.modules);
        assert.ok('demoTestAsyncOne' in result);
        assert.ok('demoTestAsyncTwo' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunTestCaseWithBeforeAndAfter: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
      var globals = {
        calls : 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals: globals
      }, {
        output_folder: false,
        start_session: true,
        testcase: 'demoTestSyncOne'
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 4);
        var result = results.modules.syncBeforeAndAfter.completed;
        assert.ok('demoTestSyncOne' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithAsyncHooks: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/withasynchooks');
      var globals = {
        calls : 0
      };

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        custom_commands_path: path.join(__dirname, '../../extra/commands'),
        silent: true,
        output: false,
        persist_globals : true,
        globals: globals
      }, {
        output_folder: false, 
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 7);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test async afterEach hook timeout error': function (done) {
      var testsPath = path.join(__dirname, '../../asynchookstests/afterEach-timeout');
      var globals = {
        calls : 0,
        asyncHookTimeout: 10
      };

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals: globals
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.equal(err.message, 'done() callback timeout of 10 ms was reached while executing "afterEach". ' +
          'Make sure to call the done() callback when the operation finishes.');
        assert.ok(err instanceof Error);

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    }
  }
};
