/**
 * Module dependencies
 */
const Nightwatch = require('../lib/index.js');
const {Logger} = require('../lib/utils');

Nightwatch.cli(async function(argv) {
  argv._source = argv['_'].slice(0);

  const runner = Nightwatch.CliRunner(argv);
  await runner.setup().catch(err => {
    err.message = 'An error occurred while trying to start the Nightwatch Runner: ' + err.message;
    Logger.error(err);
    process.exit(2);
  });
  try {
    try {
      await runner.startWebDriver();
      await runner.runTests();
    } catch (err) {
      runner.processListener.setExitCode(10);
    }
    await runner.stopWebDriver();
  } catch (err) {
    Logger.log(err);
  }
});
