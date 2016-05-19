var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');

module.exports = {
  'testRunWithGlobalHooks' : {

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

    testRunWithGlobalBeforeAndAfter: function (done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after');
      var beforeEachCount = 0;
      var afterEachCount = 0;

      var globals = {
        calls: 0,
        beforeEach: function () {
          beforeEachCount++;
        },
        afterEach: function () {
          afterEachCount++;
        }
      };

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals : globals
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 17);
        assert.equal(beforeEachCount, 3);
        assert.equal(afterEachCount, 3);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithGlobalAsyncBeforeEachAndAfterEach: function (done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after');
      var globals = {
        calls: 0,
        beforeEach: function (cb) {
          setTimeout(function () {
            beforeEachCount++;
            cb();
          }, 10);
        },
        afterEach: function (cb) {
          setTimeout(function () {
            afterEachCount++;
            cb();
          }, 10);
        }
      };
      var beforeEachCount = 0;
      var afterEachCount = 0;
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
        assert.equal(beforeEachCount, 3);
        assert.equal(afterEachCount, 3);
        assert.equal(globals.calls, 17);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithGlobalAsyncBeforeEachAndAfterEachWithBrowser: function (done) {
      //test.expect(25);
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after');
      var globals = {
        calls: 0,
        beforeEach: function (client, done) {
          assert.deepEqual(client.globals, this);
          setTimeout(function () {
            beforeEachCount++;
            done();
          }, 10);
        },
        afterEach: function (client, cb) {
          setTimeout(function () {
            afterEachCount++;
            cb();
          }, 10);
        }
      };
      var beforeEachCount = 0;
      var afterEachCount = 0;
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
        assert.equal(beforeEachCount, 3);
        assert.equal(afterEachCount, 3);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test run with global async beforeEach and assert failure': function (done) {
      var Runner = common.require('runner/run.js');
      var beforeEachCount = 0;
      var testsPath = path.join(__dirname, '../../sampletests/before-after');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
          beforeEach: function (client, done) {
            client.perform(function () {
              beforeEachCount++;
              client.assert.equal(0, 1);
              done();
            });
          }
        }
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }

        assert.equal(results.modules.sampleSingleTest.errmessages.length, 0);
        assert.equal(beforeEachCount, 3);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test run with global async beforeEach and exception': function (done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals: {
          beforeEach: function (client, done) {
            client.perform(function () {
              throw new Error('x');
            });
          }
        }
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.equal(results.modules.sampleSingleTest.errmessages.length, 1);
        assert.equal(results.modules.sampleWithBeforeAndAfter.errmessages.length, 1);
        assert.equal(results.modules.syncBeforeAndAfter.errmessages.length, 1);
        assert.equal(results.modules.sampleSingleTest.errmessages[0].indexOf('Error while running perform command:'), 0);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test run with global async beforeEach and done(err);': function (done) {
      var Runner = common.require('runner/run.js');
      var testsPath = path.join(__dirname, '../../sampletests/before-after');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        persist_globals : true,
        globals: {
          beforeEach: function (client, cb) {
            setTimeout(function () {
              cb(new Error('global beforeEach error'));
            }, 10);
          }
        }
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'global beforeEach error');

        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    'test currentTest in global beforeEach/afterEach': function (done) {
      var Runner = common.require('runner/run.js');
      //test.expect(18);
      var testsPath = path.join(__dirname, '../../sampletests/withfailures');
      var globals = {
        calls: 0,
        beforeEach: function (client, done) {
          assert.deepEqual(client.currentTest.results.steps, ['demoTest', 'demoTest2']);
          assert.equal(client.currentTest.results.passed, 0);
          assert.equal(client.currentTest.results.failed, 0);
          assert.equal(client.currentTest.results.tests, 0);
          assert.deepEqual(client.currentTest.module, 'sample');
          assert.deepEqual(client.currentTest.name, '');
          globals.calls++;
          done();
        },
        afterEach: function (client, done) {
          assert.deepEqual(client.currentTest.results.steps, ['demoTest2']);
          assert.equal(client.currentTest.results.passed, 1);
          assert.equal(client.currentTest.results.failed, 1);
          assert.equal(client.currentTest.results.tests, 2);
          assert.ok('demoTest' in client.currentTest.results.testcases);

          assert.deepEqual(client.currentTest.name, 'demoTest');
          assert.deepEqual(client.currentTest.module, 'sample');
          globals.calls++;
          done();
        }
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
        if (err) {
          throw err;
        }
        assert.equal(globals.calls, 6);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    }
  }
};
