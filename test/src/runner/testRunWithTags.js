var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var Runner = common.require('runner/run.js');

module.exports = {
  'testRunWithTags' : {

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
    
    testRunWithTags: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
        },
        tag_filter: ['login']
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        if (err) {
          throw err;
        }
        assert.equal(Object.keys(results.modules).length, 2);
        assert.equal(('demoTagTest' in results.modules.sample.completed), true);
        assert.equal(('otherDemoTagTest' in results.modules.sampleTags.completed), true);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithTagsAndFilterEmpty: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
        },
        filter: 'syncnames/*',
        tag_filter: ['login']
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.ok(err instanceof Error);
        assert.equal(results, false);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithTagsAndFilterNotEmpty: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
        },
        filter: 'tags/*',
        tag_filter: ['login']
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.strictEqual(err, null);
        assert.ok(('demoTagTest' in results.modules.sample.completed), 'demoTagTest was ran');
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithTagsAndSkipTags: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {

        },
        tag_filter: ['login'],
        skiptags: ['other']
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.equal(Object.keys(results.modules).length, 1);
        assert.ok(('otherDemoTagTest' in results.modules.sampleTags.completed));
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    },

    testRunWithTagsAndSkipTagsNoMatches: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests');

      var runner = new Runner([testsPath], {
        seleniumPort: 10195,
        silent: true,
        output: false,
        globals: {
        },
        tag_filter: ['other'],
        skiptags: ['login']
      }, {
        output_folder: false,
        start_session: true
      }, function (err, results) {
        assert.equal(err.message.indexOf('No tests defined!'), 0);
        assert.equal(results, false);
        done();
      });

      runner.run().catch(function(err) {
        done(err);
      });
    }
  }
};
