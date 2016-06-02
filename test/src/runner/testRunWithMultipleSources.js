var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var Runner = common.require('runner/run.js');

module.exports = {
  'testRunWithMultipleSources' : {

    before: function (done) {
      CommandGlobals.beforeEach.call(this, done);
    },

    after: function (done) {
      CommandGlobals.afterEach.call(this, done);
    },

    testRunWithMultipleSourceFiles: function (done) {
      var testsPath = [
        path.join(__dirname, '../../sampletests/async/sample.js'),
        path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js')
      ];
      var globals = {
        calls : 0
      };

      var runner = new Runner(testsPath, {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: globals,
        persist_globals : true
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.equal(globals.calls, 7);
        assert.equal(Object.keys(results.modules).length, 2);
        assert.ok('sample' in results.modules);
        assert.ok('sampleSingleTest' in results.modules);
        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    },

    testRunWithSourceFilesAndFolders: function (done) {
      var testsPath = [
        path.join(__dirname, '../../sampletests/async/sample.js'),
        path.join(__dirname, '../../sampletests/before-after/')
      ];

      var globals = {
        calls : 0
      };

      var runner = new Runner(testsPath, {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: globals,
        persist_globals : true
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.equal(globals.calls, 12);
        assert.equal(Object.keys(results.modules).length, 4);
        assert.ok('sample' in results.modules);
        assert.ok('sampleSingleTest' in results.modules);
        assert.ok('sampleWithBeforeAndAfter' in results.modules);
        assert.ok('syncBeforeAndAfter' in results.modules);
        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    }
  }
};
