module.exports = function() {
  let packageConfig = require(__dirname + '/../../package.json');

  // eslint-disable-next-line no-console
  console.log('\n  Nightwatch:');
  // eslint-disable-next-line no-console
  console.log('    version: ' + packageConfig.version);
  // eslint-disable-next-line no-console
  console.log('    changelog: https://github.com/nightwatchjs/nightwatch/releases/tag/v' + packageConfig.version + '\n');
};