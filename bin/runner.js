/**
 * Module dependencies
 */
const Nightwatch = require('../lib/index.js');
const {Logger} = require('../lib/utils');

try {
  Nightwatch.cli(async function(argv) {
    argv._source = argv['_'].slice(0);

    const runner = Nightwatch.CliRunner(argv);
    await runner.setupAsync();

    return runner.runTests()
      .catch(err => {
        Logger.error(err);
        runner.processListener.setExitCode(10);
      });
  });
} catch (err) {
  err.message = 'An error occurred while trying to start the Nightwatch Runner: ' + err.message;
  Logger.error(err);
  process.exit(2);
}
