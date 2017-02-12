var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');
var tagListRun = common.require('runner/taglistrun.js');

module.exports = {
  'testRunWithListTags': {
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

    testRunWithListTags: function (done) {
      var testsPath = path.join(__dirname, '../../sampletests/tags');
      var runner = new tagListRun( [testsPath], {src_folders:testsPath}, {start_session: false} );
      var result = runner.run();

      result
        .then(function(r) {
          assert.equal( r.length, 2 );

          assert.equal( (r.indexOf('login') > -1), true );
          assert.equal( (r.indexOf('other') > -1), true );
          done();
        })
        .catch(function(er) {
          done(er);
        });
    }
  }
};