import packageConfig from '../../package.json';
const fullVersion = packageConfig.version;

export = {
  full: fullVersion,
  major: fullVersion.split('.')[0],
  minor: fullVersion.split('.')[1],
  patch: fullVersion.split('.').slice(2).join('.')
};
