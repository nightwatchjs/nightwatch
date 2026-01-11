const mergeDefaultAndNamedExports = (module) => {
  const _default = module.default || {};
  return Object.keys(module).reduce((prev, val) => {
    if (val !== 'default') {
      prev[val] = module[val];
    }

    return prev;
  }, _default);
}

/**
 * Requires a module, supporting both CommonJS and ES6 modules.
 *
 * @param {string} fullpath - The full path to the module to require.
 * @returns {any|Promise<any>} - The required module or a promise that resolves to the required module.
 */
module.exports = function (fullpath) {
  let exported;
  try {
    exported = require(fullpath);
  } catch (err) {
    const isEsmSyntaxError = err.message === 'Cannot use import statement outside a module' ||
      err.message.includes('Unexpected token \'export\'');
    const isMjsFile = fullpath.endsWith('.mjs');

    // calling require() on a .mjs file on Node.js < 20 throws ERR_REQUIRE_ESM.
    // calling require() on a .mjs file on Node.js >= 20 passes through without
    // any error, but if ts-node is activated, it throws ERR_REQUIRE_ESM in normal
    // cases (it still relies on the old CommonJS loader) and isEsmSyntaxError if
    // v8-compile-cache-lib is used (see PR #1234).
    // Use dynamic import() in both cases.
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
