const path = require('path');
const lodashClone = require('lodash.clone');
const lodashMerge = require('lodash.merge');
const defaultsDeep = require('lodash.defaultsdeep');
const TestHooks = require('./hooks.js');
const Context = require('./context.js');
const Utils = require('../utils');

class GlobalsContext extends Context {
  get isTestHook() {
    return true;
  }

  constructor(settings, argv, currentEnv) {
    super({modulePath: settings.globals_path, settings, argv});

    this.currentEnv = currentEnv;
    this.argv = argv;

    this.loadModule();
    this.setCurrentEnv();
  }

  get testsuite() {
    return this.module;
  }

  loadModule(isRetry = false) {
    if (this.settings.globals_path) {
      try {
        this.__module = require(this.modulePath);

        if (!this.__module) {
          throw new Error(`Empty module provided in: "${this.modulePath}".`);
        }
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND' && !isRetry) {
          this.modulePath = path.join(Utils.getConfigFolder(this.argv), this.settings.globals_path);
          this.loadModule(true);

          return this;
        }

        err.detailedErr = err.message;
        err.message = `cannot read external global file using "${this.settings.globals_path}"`;
        err.showTrace = false;

        throw err;
      }

      defaultsDeep(this.__module, this.settings.globals);

      this.mergeGlobalsOntoSettings();
    } else {
      this.__module = this.settings.globals;
    }

    return this;
  }

  /**
   * Merges the contents of the external globals back to the settings object in order for it to be available between
   *  test runs;
   *
   * This can be either as it is, so that any changes on the globals are maintained, or as a deep copy
   *
   * @return {GlobalsContext}
   */
  mergeGlobalsOntoSettings() {
    if (this.settings.persist_globals) {
      Object.assign(this.settings.globals, this.module);
    } else {
      // if we already have globals, make a copy of them
      let existingGlobals = lodashClone(this.settings.globals, true);
      lodashMerge(existingGlobals, this.module);
      this.settings.globals = existingGlobals;
    }

    return this;
  }

  extendContextWithApi(context, api) {
    if (('client' in context) && this.modulePath &&
      context.client && !('currentTest' in context.client)) {
      throw new Error('There is already a .client property defined in: ' + this.modulePath);
    }

    Object.defineProperty(context, 'client', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: api
    });
  }

  callAsync({fnName, api, expectedArgs = 2, done = function() {}}) {
    let fnAsync = Utils.makeFnAsync(expectedArgs, this.module[fnName], this.module);
    let args = this.getHookFnArgs(done, api, expectedArgs);

    return fnAsync.apply(this.module, args);
  }

  /**
   *
   * @param {string} fnName
   * @param args
   */
  call(fnName, ...args) {
    const client = args[0];
    if (client) {
      client.isES6AsyncTestcase = this.isES6Async(fnName);
      args[0] = client.api;
    }

    return this.module[fnName].apply(this.module, args);
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
      /*eslint no-prototype-builtins: 'warn'*/
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
    const settingsCopy = lodashClone(this.settings, true);
    delete settingsCopy.globals;

    try {
      Object.defineProperty(this.globals, 'settings', {
        enumerable: false,
        configurable: false,
        get() {
          return settingsCopy;
        }
      });
      // eslint-disable-next-line
    } catch (err) {}
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
