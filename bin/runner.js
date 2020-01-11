/**
 * Module dependencies
 */
const Nightwatch = require('../lib/index.js');
const {Logger} = require('../lib/utils');

try {
  Nightwatch.cli(function(argv) {
    argv._source = argv['_'].slice(0);

    const runner = Nightwatch.CliRunner(argv);
    runner.setup()
      .startWebDriver()
      .catch(err => {
        throw err;
      })
      .then(() => {
        return runner.runTests();
      })
      .catch(err => {
        runner.processListener.setExitCode(10);
      })
      .then(() => {
        return runner.stopWebDriver();
      })
      .catch(err => {
        Logger.error(err);
      });
  });
} catch (err) {
  err.message = 'An error occurred while trying to start the Nightwatch Runner: ' + err.message;
  Logger.error(err);
  process.exit(2);
}
