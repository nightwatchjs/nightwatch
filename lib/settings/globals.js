const path = require('path');
const lodashClone = require('lodash.clone');
const lodashMerge = require('lodash.merge');
const TestHooks = require('../testsuite/hooks.js');
const Context = require('../testsuite/context.js');
const Utils = require('../util/utils.js');

class GlobalsContext extends Context {
  constructor(settings, argv, currentEnv) {
    super(settings.globals_path, settings);

    this.currentEnv = currentEnv;
    this.argv = argv;

    this.loadModule();
    this.setCurrentEnv();
  }

  loadModule(isRetry = false) {
    if (this.settings.globals_path) {
      try {
        super.loadModule();
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND' && !isRetry) {
          this.modulePath = path.join(Utils.getConfigFolder(this.argv), this.settings.globals_path);
          this.loadModule(true);

          return this;
        }

        err.detailedErr = err.name + ': ' + err.message;
        err.message = `Error reading external global file using "${this.settings.globals_path}"`;

        throw err;
      }

      if (this.settings.persist_globals) {
        Object.assign(this.settings.globals, this.module);
      } else {
        // if we already have globals, make a copy of them
        let existingGlobals = lodashClone(this.settings.globals, true);
        lodashMerge(existingGlobals, this.module);
        this.settings.globals = existingGlobals;
      }

    } else {
      this.__module = this.settings.globals;
    }

    return this;
  }

  hasHook(key) {
    return typeof this.moduleCopy[key] == 'function';
  }

  getKey(key) {
    return this.moduleCopy[key];
  }

  /**
   *
   * @param {function} done
   * @param {Object} api
   * @param {Number} expectedArgs
   * @return []
   */
  getHookFnArgs(done, api, expectedArgs) {
    return expectedArgs === 1 ? [done] : [api, done];
  }

  setCurrentEnv() {
    this.moduleCopy = lodashClone(this.module, true);

    // select globals from the current environment
    if (this.currentEnv) {
      if (this.currentEnv && this.__module.hasOwnProperty(this.currentEnv)) {
        Object.assign(this.__module, this.module[this.currentEnv]);
      }
    }
  }
}

class Globals {
  constructor(settings, argv, currentEnv = '') {
    this.settings = settings;
    this.argv = argv;
    this.currentEnv = currentEnv;

    this.readExternal();
    this.mergeWithExisting();
    this.setupGlobalHooks();
  }

  get globals() {
    return this.context.module;
  }

  readExternal() {
    this.context = new GlobalsContext(this.settings, this.argv, this.currentEnv);
  }

  /**
   * Shallow merge with existing globals on the settings object
   */
  mergeWithExisting() {
    Object.assign(this.settings.globals, this.globals);
  }

  setupGlobalHooks() {
    this.hooks = new TestHooks(this.context, {
      isGlobal: true,
      asyncHookTimeout: this.settings.globals.asyncHookTimeout
    });
  }
}

module.exports = Globals;