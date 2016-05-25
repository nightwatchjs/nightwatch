var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var Runner = common.require('runner/run.js');

module.exports = {
  'testRunWithGlobalReporter' : {

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

    testRunWithGlobalReporter: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/before-after');
      var reporterCount = 0;
      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
          reporter: function (results) {
            assert.ok('modules' in results);
            reporterCount++;
          }
        }
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(reporterCount, 1);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithGlobalAsyncReporter: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/before-after');
      var reporterCount = 0;
      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
          reporter: function (results, cb) {
            assert.ok('modules' in results);
            reporterCount++;
            cb();
          }
        }
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(reporterCount, 1);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    }
  }
};
