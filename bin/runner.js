/**
 * Module dependencies
 */
const Nightwatch = require('../lib/index.js');
const Utils = require('../lib/util/utils.js');
const Logger = require('../lib/util/logger.js');

try {
  Nightwatch.cli(function(argv) {
    argv._source = argv['_'].slice(0);

    const runner = Nightwatch.CliRunner(argv);
    runner.setup().startWebDriver()
      .catch(err => {
        process.exit(5);
      })
      .then(() => {
        return runner.runTests();
      })
      .then(() => {
        return runner.stopWebDriver();
      });
  });
} catch (ex) {
  Utils.showStackTraceWithHeadline('There was an error while starting the test runner:\n', ex.stack + '\n', true);
  process.exit(2);
}