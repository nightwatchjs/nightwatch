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
      '@unitTest' : false,
      '@name' : undefined,
      '@endSessionOnFail' : undefined,
      '@skipTestcasesOnFail' : undefined,
      '@disabled' : false,
      '@desiredCapabilities' : null,
      '@tags' : null
    };
  }

  constructor(modulePath, settings) {
    this.settings = settings;

    if (modulePath) {
      this.modulePath = modulePath;
      this.__moduleName = path.basename(this.modulePath, Context.FILENAME_EXT);
    }

    this.__module = null;
    this.__currentRunnable = null;
  }

  init(argv = {}) {
    this.currentTest = argv.testcase;
    this.source = argv._source;
    this.groupName = '';

    this.loadModule();
    this.createInterface();
    this.createTestSuite();
    this.readAttributes();

    return this;
  }

  get unitTestsMode() {
    return this.settings.unit_tests_mode || this.isUnitTest();
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

  get currentRunnable() {
    return this.__currentRunnable;
  }

  get queue() {
    return this.currentRunnable && this.currentRunnable.queue;
  }

  get queueStarted() {
    return this.queue && this.queue.rootNode.started;
  }

  getName() {
    return this.moduleName;
  }

  setCurrentRunnable(runnable) {
    this.__currentRunnable = runnable;

    return this;
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
      throw new Error(`Empty module provided in: "${this.modulePath}".`);
    }

    return this;
  }

  createTestSuite() {
    let testHooks = Object.keys(TestHooks.TEST_HOOKS);

    this.__hooks = [];
    this.__moduleKeys = this.interface.loadTests();

    this.__moduleKeys = this.__moduleKeys.reduce((accumulator, item) => {
      if (testHooks.includes(item)) {
        this.__hooks.push(item);

        return accumulator;
      }

      if (!this.currentTest || item === this.currentTest) {
        accumulator.push(item);
      }

      return accumulator;
    }, []);

    if (this.currentTest && this.tests.length === 0) {
      throw new Error(`"${this.currentTest}" is not a valid testcase in the current test suite.`);
    }

    this.__moduleKeysCopy = this.__moduleKeys.slice(0);
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

  readAttributes() {
    this.attributes = Object.keys(Context.DEFAULT_ATTRIBUTES).reduce((prev, key) => {
      let value = this.getAttribute(key);
      prev[key] = value !== undefined ? value : Context.DEFAULT_ATTRIBUTES[key];

      return prev;
    }, {});

    return this;
  }

  isDisabled() {
    return this.attributes['@disabled'] === true;
  }

  isUnitTest() {
    return this.attributes['@unitTest'] === true;
  }

  getSkipTestcasesOnFail() {
    return this.attributes['@skipTestcasesOnFail'];
  }

  getEndSessionOnFail() {
    return this.attributes['@endSessionOnFail'];
  }

  getNameAttr() {
    return this.attributes['@name'];
  }

  getTags() {
    return this.attributes['@tags'];
  }

  getDesiredCapabilities() {
    return this.attributes['@desiredCapabilities'];
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
   * @param {Number} expectedArgs
   * @param {function} done
   * @return {*}
   */
  callAsync(fnName, api, expectedArgs = 2, done = function() {}) {
    let fnAsync = Utils.makeFnAsync(expectedArgs, this.module[fnName], this.module);
    let args = this.getHookFnArgs(done, api, expectedArgs);

    return fnAsync.apply(this.module, args);
  }

  /**
   *
   * @param {function} done
   * @param {Object} api
   * @param {Number} expectedArgs
   * @return []
   */
  getHookFnArgs(done, api, expectedArgs) {
    if (this.unitTestsMode) {
      return [done];
    }

    const args = [api];
    if (expectedArgs === 2) {
      args.push(done);
    }

    return args;
  }

  extendContextWithApi(api) {
    if (('client' in this.__module) && this.modulePath &&
        this.module.client && !('currentTest' in this.module.client)) {
      throw new Error('There is already a .client property defined in: ' + this.modulePath);
    }

    this.__module.client = api;
  }

  /**
   *
   * @param {string} key
   * @param {Object} api
   * @param {Number} argsCount
   * @param {function} done
   * @return {*}
   */
  invokeMethod(key, api, argsCount, done) {
    this.extendContextWithApi(api);

    switch (argsCount) {
      case 2:
      case 1:
        return this.callAsync(key, api, argsCount, done);

      case 0: {
        try {
          let result = this.call(key);
          if (!(result instanceof Promise)) {
            return done();
          }

          result.then(() => {
            done();
          }).catch(err => {
            done(err);
          });
        } catch (err) {
          done(err);
        }
      }
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

  reset() {
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
  setReportKey() {
    let diffInFolder = '';
    let folder;
    let parentFolder = '';
    let modulePathParts = this.modulePath.split(path.sep);
    modulePathParts.pop();
    let filePath = modulePathParts.join(path.sep);
    let srcFolders = this.settings.src_folders || this.source;

    if (srcFolders) {
      for (let i = 0; i < srcFolders.length; i++) {
        folder = path.resolve(srcFolders[i]);

        if (this.settings.src_folders && this.settings.src_folders.length > 1) {
          parentFolder = folder.split(path.sep).pop();
        }

        // checks if the file path starts with the source folder
        if (filePath.startsWith(folder)) {
          diffInFolder = filePath.substring(folder.length + 1);
          break;
        }
      }
    }

    // removes trailing slash
    if (diffInFolder.substr(-1) === path.sep) {
      diffInFolder = diffInFolder.substring(0, diffInFolder.length-1);
    }

    this.groupName = diffInFolder.split(path.sep).pop(); // in case we're in a sub-folder
    this.moduleKey = path.join(parentFolder, diffInFolder, this.moduleName);

    return this;
  }
}

module.exports = Context;