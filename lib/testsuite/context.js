const path = require('path');
const ExportsInterface = require('./interfaces/exports.js');
const Utils = require('../util/utils.js');
const TestHooks = require('./hooks.js');

class Context {
  static get FILENAME_EXT() {
    return '.js';
  }

  static get DEFAULT_ATTRIBUTES() {
    return {
      '@endSessionOnFail' : true,
      '@disabled' : false,
      '@desiredCapabilities' : null,
      '@tags' : null
    }
  }

  constructor(modulePath, settings, addtOpts = {}) {
    this.modulePath = modulePath;
    this.settings = settings;
    this.__module = null;

    this.init(addtOpts);

    this.loadModule();
    this.createInterface();
    this.createTestSuite();

    this.__moduleName = path.basename(this.modulePath, Context.FILENAME_EXT);
  }

  init(addtOpts) {
    this.attributes = Object.assign({}, Context.DEFAULT_ATTRIBUTES);
    this.currentTest = addtOpts.testcase;
    this.groupName = '';
    this.testSuiteName = null;
  }

  get moduleName() {
    return this.__moduleName;
  }

  get module() {
    return this.__module;
  }

  get tests() {
    return this.__moduleKeys;
  }

  get hooks() {
    return this.__hooks;
  }

  getName() {
    return this.moduleName;
  }

  createInterface() {
    this.interface = new ExportsInterface(this.module, this.currentTest);

    return this;
  }

  loadModule() {
    try {
      this.__module = require(this.modulePath);
    } catch (err) {
      throw err;
    }

    if (!this.__module) {
      throw new Error(`Invalid test suite provided in: ${this.modulePath}`);
    }

    return this;
  }

  createTestSuite() {
    this.__moduleKeys = this.interface.loadTests();
    this.__hooks = [];

    if (this.currentTest && this.interface.tests.length === 0) {
      throw new Error(`Error: "${this.currentTest}" is not a valid testcase in the current test suite.`);
    }

    this.__moduleKeysCopy = this.__moduleKeys.slice(0);

    let testHooks = Object.keys(TestHooks.TEST_HOOKS);
    this.__moduleKeys = this.__moduleKeys.reduce((accumulator, item) => {
      if (testHooks.indexOf(item) === -1) {
        accumulator.push(item);
      } else {
        this.__hooks.push(item);
      }

      return accumulator;
    }, []);
  }

  ////////////////////////////////////////////////////////////////
  // Attributes
  ////////////////////////////////////////////////////////////////
  getAttribute(attrName) {
    let attrVal = this.module[attrName];
    if (attrVal === undefined) {
      attrVal = this.module[attrName.substring(1)];
    }

    return attrVal;
   }

  isDisabled() {
    return this.getAttribute('@disabled') === true;
  }

  ////////////////////////////////////////////////////////////////
  // Module calls
  ////////////////////////////////////////////////////////////////
  /**
   *
   * @param {string} fnName
   * @param args
   */
  call(fnName, ...args) {
    return this.module[fnName].apply(this.module, args);
  }

  /**
   *
   * @param {string} fnName
   * @param {Object} api
   * @param {function} done
   * @param {Number} expectedArgs
   * @return {*}
   */
  callAsync(fnName, api, done = function() {}, expectedArgs = 2) {
    let fnAsync = Utils.makeFnAsync(expectedArgs, this.module[fnName], this.module);
    let args = [done];
    if (expectedArgs === 2) {
      args.unshift(api);
    }

    return fnAsync.apply(this.module, args);
  }

  /**
   *
   * @param {string} key
   * @param {Object} api
   * @param {Number} argsCount
   * @param {function} done
   * @return {*}
   */
  invokeHookMethod(key, api, argsCount, done) {
    switch (argsCount) {
      case 2:
      case 1:
        return this.callAsync(key, api, done);
      case 0:
        let result = this.call(key);
        if (!(result instanceof Promise)) {
          throw new Error(`Method .${key}() should return a promise when no parameters are specified.`);
        }

        result.then(() => done).catch(err => done);

        return true;
    }
  }

  ////////////////////////////////////////////////////////////////
  // Module keys
  ////////////////////////////////////////////////////////////////
  hasKey(key) {
    return this.tests.indexOf(key) > -1;
  }

  hasHook(key) {
    return this.hooks.indexOf(key) > -1;
  }

  getKey(key) {
    return this.module[key];
  }

  getNextKey() {
    if (this.__moduleKeys.length) {
      return this.__moduleKeys.shift();
    }

    return null;
  }

  resetKeys() {
    this.__moduleKeys = this.__moduleKeysCopy.slice();

    return this;
  }

  removeKey(key) {
    if (Array.isArray(key)) {
      key.forEach(item => {
        this.removeKey(item);
      });

      return;
    }

    let index = this.__moduleKeys.indexOf(key);
    if (index > -1) {
      this.__moduleKeys.splice(index, 1);
    }
  }

  ////////////////////////////////////////////////////////////////
  // Reporting
  ////////////////////////////////////////////////////////////////
  setReportKey(fullPaths) {
    // FIXME: weird code
    let diffInFolder = '';
    let folder;
    let parentFolder = '';
    let modulePathParts = this.modulePath.split(path.sep);
    modulePathParts.pop();
    let filePath = modulePathParts.join(path.sep);

    if (this.settings.src_folders) {
      for (let i = 0; i < this.settings.src_folders.length; i++) {
        folder = path.resolve(this.settings.src_folders[i]);

        if (fullPaths.length > 1) {
          parentFolder = folder.split(path.sep).pop();
        }

        if (filePath.indexOf(folder) === 0) {
          diffInFolder = filePath.substring(folder.length + 1);
          break;
        }
      }
    }

    if (diffInFolder.substr(-1) === path.sep) {
      diffInFolder = diffInFolder.substring(0, diffInFolder.length-1);
    }

    this.groupName = diffInFolder.split(path.sep).pop(); // in case we're in a sub-folder
    this.moduleKey = path.join(parentFolder, diffInFolder, this.moduleName);

    return this;
  }
}

module.exports = Context;