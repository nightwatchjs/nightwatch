var common = require('../../../common.js');
var path = require('path');
var assert = require('assert');
var Globals = require('../../../lib/globals/commands.js');
var CliRunner = common.require('runner/cli/clirunner.js');

var originalExit = process.exit;
module.exports = {
  'test Mocha integration' : {
    beforeEach : function(done) {
      Globals.beforeEach.call(this, done);
    },

    afterEach: function(done) {
      process.removeAllListeners('exit');
      process.removeAllListeners('uncaughtException');
      process.exit = originalExit;
      Globals.afterEach.call(this, done);
    },

    testRunMochaSampleTests : function(done) {
      var runner = new CliRunner({
        config : path.join(__dirname, '../../../extra/withmocha.json'),
        env : 'default',
        verbose : false
      }).init();

      runner.test_settings.globals.test_calls = 0;

      process.exit = function(code) {
        assert.equal(runner.test_settings.globals.test_calls, 12);
        assert.equal(code, 10);
        done();
      };

      var mocha = runner.runner(function(err, results) {
        assert.equal(err, null);
        assert.equal(results.failed, 2);
      });

      assert.equal(mocha.options.ui, 'bdd');

    }
  }
};
