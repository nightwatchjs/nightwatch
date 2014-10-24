/**
 * Module dependencies
 */
var Logger = require('../lib/util/logger.js');
var Nightwatch = require('../lib/index.js');

try {
  Nightwatch.cli(function(argv) {
    Nightwatch.runner(argv);
  });
} catch (ex) {
  Logger.error('There was an error while starting the test runner:\n\n');
  process.stderr.write(ex.stack + '\n');
  process.exit(2);
}
