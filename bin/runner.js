/**
 * Module dependencies
 */
var Logger = require('../lib/util/logger.js');
var Nightwatch = require('../lib/index.js');
var Utils = require('../lib/util/utils.js');

try {
  Nightwatch.cli(function(argv) {
    argv._source = argv['_'].slice(0);
    Nightwatch.runner(argv);
  });
} catch (ex) {
  Utils.showStackTraceWithHeadline('There was an error while starting the test runner:\n', ex.stack + '\n', true);
  process.exit(2);
}
