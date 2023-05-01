const path = require('path');
const EventEmitter = require('events');
const Utils = require('../utils');

const ExportsInterface = require('./interfaces/exports.js');
const DescribeInterface = require('./interfaces/describe.js');

class Context extends EventEmitter {
  static get REPORT_KEY_SEPARATOR() {
    return path.sep;
  }

  get isTestHook() {
    return false;
  }

  constructor({modulePath, settings, argv = {}, attributes = {}}) {
    super();
    this.settings = settings;
    this.argv = argv;

    this.__module = null;
    this.__testsuite = {};
    this.__currentRunnable = null;
    this.__retries = {
      testcase: null,
      suite: null
    };
    this.attributes = attributes;
    this.groupName = '';

    if (modulePath) {
      this.setModulePath(modulePath);
    }
  }

  setModulePath(file) {
    this.modulePath = file;
    this.__moduleName = path.parse(this.modulePath).name;
    this.moduleKey = this.moduleName || '';
  }

  loadTags({usingMocha = false} = {}) {
    if (!usingMocha) {
      return;
    }

    const context = this;
    const {Suite} = require('mocha');
    class BasicSuite extends Suite {
      get tags() {
        return context.attributes['@tags'];
      }

      set tags(value) {
        context.attributes['@tags'] = value;
      }
    }

    global.describe = function(title, definitionFn) {
      const instance = new BasicSuite(title);

      definitionFn.call(instance);
    };

    try {
      this.__module = this.requireModule(this.modulePath); // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  async init({usingMocha = false, suiteTitle = null, client = null} = {}) {
    this.__currentTestName = this.argv.testcase;
    this.__testSuiteName = suiteTitle;

    this.__hooks = [];
    this.__testcases = [];
    this.__skippedTestCases = [];
    this.__allScreenedTests = [];
    this.__contextBinding = {};

    this.__transforms = client ? await client.transforms : [];


    this.source = this.argv._source || [];

    if (!usingMocha) {
      this.createInterface(client);
      await this.loadModule();
    }

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

  /**
   * @returns {boolean}
   */
  get unitTestingMode() {
    return this.settings.unit_testing_mode || this.isUnitTest();
  }

  /**
   * @deprecated
   * @returns {boolean}
   */
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

  get skippedTests() {
    return this.__skippedTestCases;
  }

  set skippedTests(value) {
    this.__skippedTestCases = value;
  }

  get allScreenedTests() {
    return this.__allScreenedTests;
  }

  set allScreenedTests(value) {
    this.__allScreenedTests = value;
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

  createInterface(client) {
    this.exportsInterface = new ExportsInterface(this);
    this.bddInterface = new DescribeInterface(this, client);

    return this;
  }

  async loadModule() {
    this.emit('pre-require', global);

    this.__module = await this.requireModule();

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

  async requireModule(loadJsWithPlugins = false) {
    const pluginDescriptor = this.__transforms.find(transform => {
      const {filter} = transform;

      if (Utils.isFunction(filter)) {
        return filter(this.modulePath, loadJsWithPlugins);
      }

      return filter.test(this.modulePath);
    });

    if (pluginDescriptor) {
      try {
        await pluginDescriptor.requireTest(this.modulePath, pluginDescriptor, {
          argv: this.argv,
          nightwatch_settings: this.settings
        });

        return {};
      } catch (err) {
        const error = new Error(`Error while trying to load ${this.modulePath}`);
        error.detailedErr = err.message;
        error.stack = err.stack;

        throw error;
      }
    }

    try {
      return Utils.requireModule(this.modulePath);
    } catch (err) {
      if ((err instanceof SyntaxError) && !loadJsWithPlugins) {
        return await this.requireModule(true);
      }

      throw err;
    }
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
   * @param {Boolean=false} [skipTest] If the testcase should be skipped
   */
  addTestCase({testName, testFn, describeInstance, runOnly, skipTest}) {
    if (!Utils.isFunction(testFn)) {
      throw new Error(`The "${testName}" test script must be a function. "${typeof testFn}" given.`);
    }

    // TODO: warn if test name already exists
    if (!skipTest) {
      this.tests.push(testName);
    } else {
      this.skippedTests.push(testName);
    }

    this.addTestSuiteMethod(testName, testFn, describeInstance);
    if (runOnly) {
      this.__currentTestName = testName;
      this.skippedTests = [...this.allScreenedTests];
      this.runOnly = true;
    } else if (this.runOnly) {
      this.skippedTests.push(testName);
    }

    this.allScreenedTests.push(testName);
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
      // eslint-disable-next-line no-console
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
    const isTestHook = this.isTestHook;

    if (client) {
      client.isES6AsyncTestcase = isES6Async;
      client.isES6AsyncTestHook = isTestHook ? isES6Async : undefined;
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
        return this.callAsync({fnName, api, expectedArgs, done, context, isES6Async, isTestHook});

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
      const isES6Async = this.isES6Async(fnName);
      client.isES6AsyncTestcase = isES6Async;
      client.isES6AsyncTestHook = this.isTestHook ? isES6Async : undefined;
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
  setReportKey(allModulePaths = []) {
    if (!this.modulePath) {
      return;
    }

    let parentFolder = this.modulePath.substring(0, this.modulePath.lastIndexOf(path.sep));
    const parentFolderName = parentFolder.split(path.sep).pop();
    const srcFolders = this.settings.src_folders || this.source || [];

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
      const modulePath = path.sep + moduleKey;

      return item.endsWith(modulePath + Utils.jsFileExt) || item.endsWith(modulePath + Utils.tsFileExt);
    });

    if (isKeyUnique) {
      return moduleKey;
    }

    moduleKey = [modulePathParts.pop(), moduleKey].join(Context.REPORT_KEY_SEPARATOR);

    return this.getUniqueModuleKey(modulePathsCopy, modulePathParts, moduleKey);
  }
}

module.exports = Context;
