const mergeDefaultAndNamedExports = (module) => {
  const _default = module.default || {};
  return Object.keys(module).reduce((prev, val) => {
    if (val !== 'default') {
      prev[val] = module[val];
    }

    return prev;
  }, _default);
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
      const { pathToFileURL } = require('node:url');

      return import(pathToFileURL(fullpath).href).then(mergeDefaultAndNamedExports);
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
    // ESM module with named exports present (with or without default export).
    return mergeDefaultAndNamedExports(exported);
  }

  return exported;
}
