const packageConfig = require('../../package.json'); // eslint-disable-line @typescript-eslint/no-var-requires
const fullVersion: string = packageConfig.version!;

export = {
  full: fullVersion,
  major: fullVersion.split('.')[0],
  minor: fullVersion.split('.')[1],
  patch: fullVersion.split('.').slice(2).join('.')
};
