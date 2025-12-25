const getNodeVersion = () => {
  const version = process.version.replace('v', '');
  
  return parseInt(version, 10);
}

module.exports = function (fullpath) {
  let exported;
  try {
    exported = require(fullpath);
  } catch (err) {
    // In Node 20+, .mjs files might trigger syntax errors when processed by compile caches
    // Check if this is an ESM file that should be dynamically imported
    const isEsmSyntaxError = err.message === 'Cannot use import statement outside a module' || 
                             err.message.includes('Unexpected token \'export\'');
    const isMjsFile = fullpath.endsWith('.mjs');
    
    // If it's a .mjs file with ESM syntax errors, or ERR_REQUIRE_ESM, use dynamic import
    if (err.code === 'ERR_REQUIRE_ESM' || (isMjsFile && isEsmSyntaxError)) {
      if (getNodeVersion() >= 14) {
        const {pathToFileURL} = require('node:url');
        
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
    
    // For non-ESM files with ESM syntax errors, provide helpful error message
    if (isEsmSyntaxError) {
      err.detailedErr = err.message;
      err.help = ['Using ES6 import/export syntax? - make sure to specify "type=module" in your package.json or use .mjs extension.'];
      err.link = 'https://nodejs.org/api/esm.html';
    }

    throw err;
  }

  // In Node 20+, .mjs files can be required and return an object like { __esModule: true, default: <value> }
  // Extract the default export if it's the only meaningful export
  if (exported && Object.prototype.hasOwnProperty.call(exported, 'default')) {
    const keys = Object.keys(exported);
    // Return default if it's the only key, or if only __esModule and default are present
    if (keys.length === 1 || (keys.length === 2 && exported.__esModule === true)) {
      return exported.default;
    }
  }

  return exported;
}
