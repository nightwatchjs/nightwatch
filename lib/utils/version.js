const packageConfig = require(__dirname + '/../../package.json');
const fullVersion = packageConfig.version;

module.exports = {
  full: fullVersion,
  major: fullVersion.split('.')[0],
  minor: fullVersion.split('.')[1],
  patch: fullVersion.split('.').slice(2).join('.')
};
