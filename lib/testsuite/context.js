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

  static get REPORT_KEY_SEPARATOR() {
    return '/';
  }

  constructor(modulePath, settings) {
    this.settings = settings;

    if (modulePath) {
      this.modulePath = modulePath;
      this.__moduleName = path.basename(this.modulePath, Context.FILENAME_EXT);
    }

    this.__module = null;
    this.__currentRunnable = null;

    this.groupName = '';
    this.moduleKey = this.moduleName || '';
  }

  init(argv = {}) {
    this.currentTest = argv.testcase;
    this.source = argv._source || [];

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
  xgetDiffFromSourceFolder(sourceFolder) {
    let diffInFolder = '';
    let folder = path.resolve(sourceFolder);

    // drop the module name and keep only the path to the parent folder
    let modulePathParts = this.modulePath.split(path.sep);
    modulePathParts.pop();

    let parentFolder = modulePathParts.join(path.sep);

    // checks if the file path starts with the source folder
    if (parentFolder.startsWith(folder)) {
      diffInFolder = parentFolder.substring(folder.length + 1);
    }

    if (diffInFolder.substr(-1) === path.sep) {
      diffInFolder = diffInFolder.substring(0, diffInFolder.length-1);
    }

    if (diffInFolder) {
      this.groupName = diffInFolder.split(path.sep).pop();
      this.moduleKey = path.join(diffInFolder, this.moduleName);
    }
  }

  setReportKey(allModulePaths) {
    let parentFolder = this.modulePath.substring(0, this.modulePath.lastIndexOf(path.sep));
    const parentFolderName = parentFolder.split(path.sep).pop();
    const srcFolders = this.settings.src_folders || this.source;

    let diffInFolder = '';

    if (srcFolders.length > 0) {
      for (let i = 0; i < srcFolders.length; i++) {
        let srcPathResolved = path.resolve(srcFolders[i]);
        diffInFolder = this.getDiffFromSourceFolder(srcPathResolved, parentFolder, srcFolders);

        if (diffInFolder) {
          this.moduleKey = [diffInFolder, this.moduleKey].join(Context.REPORT_KEY_SEPARATOR);
          this.groupName = parentFolderName;
          parentFolder = parentFolder.substring(0, parentFolder.lastIndexOf(path.sep + diffInFolder)); // removing the diffInFolder string from the parent folder
          break;
        }
      }
    }

    // in case we're using src_folders and there are more than one, prepend the parent folder name to the report key
    if (diffInFolder === '' && Array.isArray(this.settings.src_folders) && this.settings.src_folders.length > 1) {
      this.moduleKey = [parentFolderName, this.moduleKey].join(Context.REPORT_KEY_SEPARATOR);
    }

    // in case there are several test files, make sure the report key is unique
    if (allModulePaths.length > 1) {
      this.moduleKey = this.checkKeyForUniqueness(allModulePaths, parentFolder);
    }
  }

  shouldCheckIfDirectory() {
    return !this.settings.src_folders && this.source.length > 1;
  }

  checkKeyForUniqueness(allModulePaths, parentFolder) {
    // removing the current module
    const modulePathsCopy = allModulePaths.slice(0);
    const index = modulePathsCopy.indexOf(this.modulePath);

    if (index > -1) {
      modulePathsCopy.splice(index, 1);
    }

    const modulePathParts = parentFolder.split(path.sep);

    return this.getUniqueModuleKey(modulePathsCopy, modulePathParts, this.moduleKey);
  }

  /**
   *
   * @param {string} srcPathResolved
   * @param {string} moduleParentFolder
   * @param {Array} source
   */
  getDiffFromSourceFolder(srcPathResolved, moduleParentFolder, source) {
    const isDirectory = !this.shouldCheckIfDirectory() || Utils.dirExistsSync(srcPathResolved);

    if (!isDirectory) {
      return '';
    }

    if (moduleParentFolder.startsWith(srcPathResolved)) {
      return moduleParentFolder.substring(srcPathResolved.length + 1).split(path.sep).join(Context.REPORT_KEY_SEPARATOR);
    }

    return '';
  }

  /**
   * In case there are multiple sources, compute the moduleKey uniquely
   *
   * @param {Array} modulePathsCopy
   * @param {Array} [modulePathParts]
   * @param {string} [moduleKey]
   * @return {string}
   */
  getUniqueModuleKey(modulePathsCopy, modulePathParts = null, moduleKey = '') {
    if (modulePathParts && modulePathParts.length < 2) {
      return moduleKey;
    }

    const isKeyUnique = !modulePathsCopy.some(item => {
      return item.endsWith(path.sep + moduleKey + Context.FILENAME_EXT);
    });

    if (isKeyUnique) {
      return moduleKey;
    }

    moduleKey = [modulePathParts.pop(), moduleKey].join(Context.REPORT_KEY_SEPARATOR);

    return this.getUniqueModuleKey(modulePathsCopy, modulePathParts, moduleKey);
  }
}

module.exports = Context;