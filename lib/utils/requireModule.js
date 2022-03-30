const path = require('path');

const requireModule = module.exports = function(fullpath, error={}) {
  let exported;
  try {
    if (Object.keys(error).length > 0) {
      throw new Error(`${error.code}: ${error.message}`)
    }
    exported = require(fullpath);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return requireModule(path.resolve(fullpath), {code: err.code, message: err.message});
    }

    if (err.code !== 'ERR_REQUIRE_ESM') {
      throw err;
    }

    return import(fullpath).then(result => (result.default || {}));
  }


  if (exported && Object.prototype.hasOwnProperty.call(exported, 'default')) {
    return exported.default;
  }

  return exported;
}
