var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var CliRunner = require('../../../'+ BASE_PATH +'/runner/cli/clirunner.js');

var originalExit = process.exit;
module.exports = {
  setUp: function(callback) {

    callback();
  },

  tearDown: function(callback) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.exit = originalExit;
    callback();
  },

  testRunMochaSampleTests : function(test) {
    var runner = new CliRunner({
      config : './extra/withmocha.json',
      env : 'default'
    }).init();

    test.expect(15);
    runner.test_settings.globals = {
      test : test
    };

    process.exit = function(code) {
      test.equals(code, 10);
      test.done();
    };

    runner.runner(function(err, results) {
      test.equals(err, null);
      test.equals(results.failed, 2);
    });
  }
};
