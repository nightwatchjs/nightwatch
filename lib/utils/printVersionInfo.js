const VERSION = require('./version');

module.exports = function() {

  // eslint-disable-next-line no-console
  console.log('\n  Nightwatch:');
  // eslint-disable-next-line no-console
  console.log('    version: ' + VERSION.full);
  // eslint-disable-next-line no-console
  console.log('    changelog: https://github.com/nightwatchjs/nightwatch/releases/tag/v' + VERSION.full + '\n');
};
