import isErrorObject = require('./isErrorObject');
import {pathToFileURL} from 'url';

function hasDefaultProperty(object: unknown): object is {default: unknown} {
  return Object.prototype.hasOwnProperty.call(object, 'default');
}

export = function (fullpath: string): unknown {
  let exported: unknown;
  try {
    exported = require(fullpath);
  } catch (err: unknown) {
    if (isErrorObject(err) && (err.message === 'Cannot use import statement outside a module' || err.message === 'Unexpected token \'export\'')) {
      err.detailedErr = err.message;
      err.help = ['Using ES6 import/export syntax? - make sure to specify "type=module" in your package.json or use .mjs extension.'];
      err.link = 'https://nodejs.org/api/esm.html';

      throw err;
    }

    if (isErrorObject(err) && err.code !== 'ERR_REQUIRE_ESM') {
      throw err;
    }

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

  if (exported && hasDefaultProperty(exported) && Object.keys(exported).length === 1) {
    return exported.default;
  }

  return exported;
};
