const getNodeVersion = () => {
  const version = process.version.replace('v', '');
  
  return parseInt(version, 10);
}

module.exports = function (fullpath) {
  let exported;
  try {
    exported = require(fullpath);
  } catch (err) {
    if (err.message === 'Cannot use import statement outside a module' || err.message === 'Unexpected token \'export\'') {
      err.detailedErr = err.message;
      err.help = ['Using ES6 import/export syntax? - make sure to specify "type=module" in your package.json or use .mjs extension.'];
      err.link = 'https://nodejs.org/api/esm.html';

      throw err;
    }

    if (err.code !== 'ERR_REQUIRE_ESM') {
      throw err;
    }

    if (getNodeVersion() >= 14) {
      const {pathToFileURL} = require('node:url');
      
      return import(pathToFileURL(fullpath).href).then(result => {
        const _default = result.default || {};

        return Object.keys(result).reduce((prev, val) => {
          if (val !== 'default') {
            prev[val] = result[val];
          }

          return prev;
        }, _default);
      });
    }

    return import(fullpath).then(result => (result.default || {}));
  }

  if (exported && Object.prototype.hasOwnProperty.call(exported, 'default') && Object.keys(exported).length === 1) {
    return exported.default;
  }

  return exported;
}
