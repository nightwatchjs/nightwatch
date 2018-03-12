const path = require('path');
const lodashClone = require('lodash.clone');
const lodashMerge = require('lodash.merge');
const TestHooks = require('../testsuite/hooks.js');
const Context = require('../testsuite/context.js');

class GlobalsContext extends Context {
  hasHook(key) {
    return typeof this.moduleCopy[key] == 'function';
  }

  getKey(key) {
    return this.moduleCopy[key];
  }

  setCurrentEnv(env) {
    // select globals from the current environment
    if (this.__module.hasOwnProperty(env)) {
      Object.keys(this.__module[env]).forEach(key => {
        this.__module[key] = this.__module[env][key];
      });
    }

    this.moduleCopy = lodashClone(this.module, true);
  }
}

class Globals {
  constructor(settings, currentEnv = '') {
    this.settings = settings;
    this.currentEnv = currentEnv;

    this.readExternal();
  }

  get globals() {
    return this.context.module;
  }

  readExternal() {
    let fullPath = path.resolve(this.settings.globals_path);

    try {
      this.context = new GlobalsContext(fullPath, this.settings);
      this.context.loadModule();
      this.context.setCurrentEnv(this.currentEnv);

      this.setupGlobalHooks();
    } catch (err) {
      err.detailedErr = err.name + ': ' + err.message;
      err.message = `Error reading external global file using "${fullPath}"`;

      throw err;
    }
  }

  setupGlobalHooks() {
    this.hooks = new TestHooks(this.context, {
      isGlobal: true,
      asyncHookTimeout: this.settings.globals.asyncHookTimeout
    });
  }

  mergeWithExisting() {
    // if we already have globals, make a copy of them
    let existingGlobals = this.settings.globals ? lodashClone(this.settings.globals, true) : {};
    lodashMerge(existingGlobals, this.globals);

    return existingGlobals;
  }
}

module.exports = Globals;