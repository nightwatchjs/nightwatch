var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var CliRunner = require('../../../'+ BASE_PATH +'/runner/cli/clirunner.js');

module.exports = {
  setUp: function(callback) {

    callback();
  },

  tearDown: function(callback) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    callback();
  },

  testRunMochaSampleTests : function(test) {
    var runner = new CliRunner({
      config : './extra/withmocha.json',
      env : 'default'
    }).init();

    runner.test_settings.globals = {
      test : test
    };

    test.expect(14);
    runner.runner(function(err, results) {
      test.equals(err, null);
      test.equals(results.failed, 2);
      test.done();
    });
  }
};
