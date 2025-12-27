const getNodeVersion = () => {
  const version = process.version.replace('v', '');

  return parseInt(version, 10);
}

module.exports = function (fullpath) {
  let exported;
  try {
    exported = require(fullpath);
  } catch (err) {
    const isEsmSyntaxError = err.message === 'Cannot use import statement outside a module' ||
      err.message.includes('Unexpected token \'export\'');
    const isMjsFile = fullpath.endsWith('.mjs');

    if (err.code === 'ERR_REQUIRE_ESM' || (isMjsFile && isEsmSyntaxError)) {
      if (getNodeVersion() >= 14) {
        const { pathToFileURL } = require('node:url');

        return import(pathToFileURL(fullpath).href).then(result => {
          const _default = result.default ?? {};

          return Object.keys(result).reduce((prev, val) => {
            if (val !== 'default') {
              prev[val] = result[val];
            }

            return prev;
          }, _default);
        });
      }

      return import(fullpath).then(result => (result.default ?? {}));
    }

    if (isEsmSyntaxError) {
      err.detailedErr = err.message;
      err.help = ['Using ES6 import/export syntax? - make sure to specify "type=module" in your package.json or use .mjs extension.'];
      err.link = 'https://nodejs.org/api/esm.html';

    }
    throw err;
  }

  if (exported && Object.prototype.hasOwnProperty.call(exported, 'default')) {
    const keys = Object.keys(exported);
    if (keys.length === 1 || (keys.length === 2 && exported.__esModule === true)) {
      return exported.default;
    }
  }
  if (exported?.__esModule === true) {
    const _default = exported.default ?? {};
    return Object.keys(exported).reduce((prev, val) => {
      if (val !== 'default') {
        prev[val] = exported[val];
      }

      return prev;
    }, _default);
  }

  return exported;
}