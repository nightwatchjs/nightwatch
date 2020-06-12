const path = require('path');
const EventEmitter = require('events');
const Utils = require('../utils');

const ExportsInterface = require('./interfaces/exports.js');
const DescribeInterface = require('./interfaces/describe.js');

class Context extends EventEmitter {
  static get FILENAME_EXT() {
    return '.js';
  }

  static get REPORT_KEY_SEPARATOR() {
    return path.sep;
  }

  constructor({modulePath, settings, argv = {}}) {
    super();
    this.settings = settings;
    this.argv = argv;

    if (modulePath) {
      this.modulePath = modulePath;
      this.__moduleName = path.basename(this.modulePath, Context.FILENAME_EXT);
    }

    this.__module = null;
    this.__testsuite = {};
    this.__currentRunnable = null;
    this.__retries = {
      testcase: null,
      suite: null
    };
    this.attributes = {};
    this.groupName = '';
    this.moduleKey = this.moduleName || '';
  }

  init() {
    this.__currentTestName = this.argv.testcase;
    this.__testSuiteName = null;

    this.__hooks = [];
    this.__testcases = [];
    this.__contextBinding = {};

    this.source = this.argv._source || [];
    this.createInterface();
    this.loadModule();
    this.createTestSuite();

    return this;
  }

  get testSuiteName() {
    return this.__testSuiteName;
  }

  get currentTest() {
    return this.__currentTestName;
  }

  get contextBinding() {
    return this.__contextBinding;
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

  get testsuite() {
    return this.__testsuite;
  }

  get tests() {
    return this.__testcases;
  }

  set tests(value) {
    this.__testcases = value;
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
    return this.queue && this.queue.started;
  }

  get retries() {
    return this.__retries;
  }

  setReloadModuleCache(val = true) {
    this.__reloadModuleCache = val;

    return this;
  }

  shouldReloadModuleCache() {
    return this.__reloadModuleCache;
  }

  get usingBddDescribe() {
    return this.bddInterface && Utils.isFunction(this.bddInterface.describeFn);
  }

  getName() {
    return this.moduleName;
  }

  getSuiteName() {
    return this.testSuiteName || Utils.getTestSuiteName(this.moduleKey);
  }

  setCurrentRunnable(runnable) {
    this.__currentRunnable = runnable;

    return this;
  }

  createInterface() {
    this.exportsInterface = new ExportsInterface(this);
    this.bddInterface = new DescribeInterface(this);

    return this;
  }

  loadModule() {
    this.emit('pre-require', global);
    this.__module = require(this.modulePath);

    if (!this.module && !this.bddInterface.describeFn) {
      throw new Error(`Empty module provided in: "${this.modulePath}".`);
    }

    if (this.module) {
      this.__testsuite = Object.assign(this.__testsuite, this.module);
    }

    this.emit('post-require');
    this.emit('module-loaded');

    return this;
  }

  createTestSuite() {
    if (this.currentTest && this.tests.length === 0) {
      throw new Error(`"${this.currentTest}" is not a valid testcase in the current test suite.`);
    }

    if (this.currentTest && this.tests.length > 1) {
      this.tests = [this.currentTest];
    }
    this.__moduleKeysCopy = this.tests.slice(0);
  }

  addTestSuiteMethod(testName, testFn, context) {
    this.testsuite[testName] = testFn;
    this.contextBinding[testName] = context || this.module;
  }

  /**
   * Add test hooks created by describe interface
   *
   * @param {string} hookName
   * @param {Function} hookFn
   * @param {Object} [context]
   */
  addTestHook(hookName, hookFn, context) {
    // TODO: warn if hook name already exists
    this.hooks.push(hookName);
    this.addTestSuiteMethod(hookName, hookFn, context);
  }

  /**
   * Add testcases created by describe interface
   *
   * @param {string} testName
   * @param {function} testFn
   * @param {Object} [describeInstance] The instance of the describe function declaration
   * @param {Boolean=false} [runOnly] If the runner should run only this testcase
   */
  addTestCase({testName, testFn, describeInstance, runOnly}) {
    if (!Utils.isFunction(testFn)) {
      throw new Error(`The "${testName}" test script must be a function. "${typeof testFn}" given.`);
    }

    // TODO: warn if test name already exists
    this.tests.push(testName);
    this.addTestSuiteMethod(testName, testFn, describeInstance);
    if (runOnly) {
      this.__currentTestName = testName;
    }
  }

  /**
   * Create a testsuite using describe interface
   *
   * @param {string} describeTitle
   * @param {Object} describeInstance The instance of the describe function declaration
   * @param {Boolean=false} [runOnly] If the runner should run only this testsuite
   */
  setDescribeContext({describeTitle, describeInstance, runOnly}) {
    if (this.__testSuiteName && !describeInstance) {
      throw new Error('There is already a top-level "describe"/"context" declaration in this testsuite.');
    }

    if (runOnly) {
      console.warn('describe.only() is not supported at the moment.');
    }

    this.__testSuiteName = describeTitle;
  }

  setTestcaseRetries(n) {
    this.retries.testcase = n;
  }

  setSuiteRetries(n) {
    this.retries.suite = n;
  }
  ////////////////////////////////////////////////////////////////
  // Attributes
  ////////////////////////////////////////////////////////////////
  isES6Async(testName) {
    return Utils.isES6AsyncFn(this.testsuite[testName]);
  }

  addAttributes(attributes = {}) {
    Object.assign(this.attributes, attributes);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  getAttribute(name) {
    return this.attributes[name];
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

  extendContextWithApi(context, api) {
    if (('client' in context) && this.modulePath &&
        context.client && !('currentTest' in context.client)) {
      throw new Error('There is already a .client property defined in: ' + this.modulePath);
    }

    context.client = api;
  }

  /**
   *
   * @param {string} fnName
   * @param {Object} client
   * @param {Number} expectedArgs
   * @param {function} done
   * @return {*}
   */
  invokeMethod(fnName, client, expectedArgs, done) {
    const isES6Async = this.isES6Async(fnName);
    if (client) {
      client.isES6AsyncTestcase = isES6Async;
    }

    const api = client && client.api || null;
    let context;
    if (this.contextBinding && this.contextBinding[fnName]) {
      context = this.contextBinding[fnName];
    } else {
      context = this.__module;
    }

    this.extendContextWithApi(context, api);

    switch (expectedArgs) {
      case 2:
      case 1:
        return this.callAsync({fnName, api, expectedArgs, done, context});

      case 0: {
        try {
          let result = this.call(fnName);
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

  /**
   * @param {string} fnName
   * @param {Array} args
   */
  call(fnName, ...args) {
    const context = this.contextBinding[fnName];
    const client = args[0];
    if (client) {
      client.isES6AsyncTestcase = this.isES6Async(fnName);
      args[0] = client.api;
    }

    return this.testsuite[fnName].apply(context, args);
  }

  /**
   *
   * @param {string} fnName
   * @param {Object} api
   * @param {Number} expectedArgs
   * @param {function} done
   * @param {Object} context
   * @return {*}
   */
  callAsync({fnName, api, expectedArgs = 2, done = function() {}, context}) {
    const fnAsync = Utils.makeFnAsync(expectedArgs, this.testsuite[fnName], context);
    const args = this.getHookFnArgs(done, api, expectedArgs);

    return fnAsync.apply(context, args);
  }

  ////////////////////////////////////////////////////////////////
  // Module keys
  ////////////////////////////////////////////////////////////////
  hasHook(key) {
    return this.hooks.indexOf(key) > -1;
  }

  getKey(key) {
    return this.testsuite[key];
  }

  getNextKey() {
    if (this.tests.length) {
      return this.tests.shift();
    }

    return null;
  }

  /**
   * When using retries, the testcases are reset
   *
   * @return {Context}
   */
  reset() {
    this.tests = this.__moduleKeysCopy.slice();

    return this;
  }

  ////////////////////////////////////////////////////////////////
  // Reporting
  ////////////////////////////////////////////////////////////////
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
