const path = require('path');
const Logger = require('../util/logger.js');

class Globals {

  static readExternal(globals_path, currentEnv = null) {
    let fullPath = path.resolve(globals_path);

    try {
      let externalGlobals = require(fullPath);

      if (!externalGlobals) {
        Logger.warn(`Empty external globals file: ${fullPath}`);
        return this;
      }

      if (externalGlobals.hasOwnProperty(currentEnv)) {
        Object.keys(externalGlobals[currentEnv]).forEach(key => {
          externalGlobals[key] = externalGlobals[currentEnv][key];
        });
      }

      return externalGlobals;
    } catch (err) {
      let originalMsg = Logger.colors.red(err.name + ': ' + err.message);

      err.name = 'Error reading external global file';
      err.message = `using ${fullPath}:\n${originalMsg}`;

      throw err;
    }
  }
}

module.exports = Globals;