var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var Runner = common.require('runner/run.js');

module.exports = {
  'testRunWithExclude' : {

    before: function (done) {
      CommandGlobals.beforeEach.call(this, done);
    },

    after: function (done) {
      CommandGlobals.afterEach.call(this, done);
    },

    testRunWithExcludeFolder: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/withexclude');
      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
        },
        exclude: ['excluded']
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.ok(!('excluded-module' in results.modules));
        assert.ok(!('not-excluded' in results.modules));
        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    testRunWithExcludePattern: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/withexclude');

      var testPattern = path.join('excluded', 'excluded-*');
      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
        },
        exclude: [testPattern]
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.ok(!('excluded-module' in results.modules));
        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    testRunWithExcludeFile: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/withexclude');
      var testPattern = path.join('excluded', 'excluded-module.js');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
        },
        exclude: [testPattern]
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.ok(!('excluded-module' in results.modules));
        assert.ok('not-excluded' in results.modules);
        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    }
  }
};
