const AssertionError = require('assertion-error');
const {By, Key, locateWith, withTagName} = require('selenium-webdriver');


const Reporter = require('../reporter');
const Context = require('./context.js');
const TestHooks = require('./hooks.js');
const TestCase = require('./testcase.js');
const Runnable = require('./runnable.js');
const Transport = require('../transport/selenium-webdriver');
const NightwatchAssertError = require('../assertion').AssertionError;
const SuiteRetries = require('./retries.js');
const NightwatchClient = require('../core/client.js');
const Concurrency = require('../runner/concurrency');
const ElementGlobal = require('../api/_loaders/element-global.js');
const {Logger, Screenshots, Snapshots, alwaysDisplayError, isString, isFunction, SafeJSON} = require('../utils');
const NightwatchInspectorServer = require('./nightwatch-inspector');
const {DEFAULT_RUNNER_EVENTS, NightwatchEventHub} = require('../runner/eventHub');
const {GlobalHook, TestSuiteHook} = DEFAULT_RUNNER_EVENTS;


class TestSuite {
  constructor({modulePath, modules, settings, argv, usingMocha = false, addtOpts = {}}) {
    this.settings = settings;
    this.argv = argv;
    this.modulePath = modulePath;
    this.allModulePaths = modules;
    this.testcase = null;
    this.currentRunnable = null;
    this.usingMocha = usingMocha;
    this.reuseBrowser = argv['reuse-browser'] || (settings.globals && settings.globals.reuseBrowserSession);
    this.globalHooks = addtOpts.globalHooks || {};
    if (addtOpts.globalsInstance) {
      this.globalsInstance = addtOpts.globalsInstance;
    }
    this.__reportPrefix = '';

    this.mochaContext = new Promise(resolve => {
      this.mochaContextResolve = resolve;
    });
  }

  get api() {
    return this.client.api;
  }

  get commandQueue() {
    if (!this.client) {
      return null;
    }

    return this.client.queue;
  }

  get reportPrefix() {
    return this.__reportPrefix;
  }

  get transport() {
    return this.client.transport;
  }

  get skipTestcasesOnFail() {
    const localDefinedValue = this.context.getSkipTestcasesOnFail();

    if (localDefinedValue !== undefined) {
      return localDefinedValue;
    }

    const settingsValueUndefined = this.settings.skip_testcases_on_fail === undefined;
    if (settingsValueUndefined && this.context.unitTestingMode) {
      // false by default when running unit tests
      return false;
    }

    // true by default when not running unit tests
    return settingsValueUndefined || this.settings.skip_testcases_on_fail;
  }

  get endSessionOnFail() {
    const definedValue = this.context.getEndSessionOnFail();

    return definedValue === undefined ? this.settings.end_session_on_fail : definedValue;
  }

  get isES6Async() {
    return this.client && (this.client.isES6AsyncTestcase || this.client.isES6AsyncTestHook);
  }

  get failFastMode() {
    return this.argv['fail-fast'] || this.settings.enable_fail_fast;
  }

  isComponentTestingMode() {
    return this.api.globals.component_tests_mode;
  }

  isE2EPreviewMode() {
    return this.argv['launch-url'];
  }

  shouldSkipTestsOnFail() {
    return this.skipTestcasesOnFail && !this.context.unitTestingMode || this.failFastMode;
  }

  async initCommon(opts = {}) {
    if (!this.settings.unit_testing_mode) {
      this.addPropertiesToGlobalScope();
    }

    await this.initClient(opts);

    if (this.isE2EPreviewMode()) {
      this.context = {
        getDesiredCapabilities() {},
        isDisabled() {
          return false;
        }
      };
      this.reporter = {
        registerTestError(err) {
          Logger.error(err);
        }
      };
    } else {
      await this.createContext(opts);
    }

    this.mochaContextResolve(this.context);

    this.setSuiteName();
    this.setRetries();
  }

  async init(opts = {}) {
    await this.initCommon(opts);
    this.updateClient();
    this.setupHooks();

    return this;
  }

  setModulePath(file) {
    this.modulePath = file;
    this.context.modulePath = file;
  }

  validateNightwatchInspectorCriteria() {
    return (
      this.argv.debug &&
      Concurrency.isMasterProcess() &&
      this.client.api.isChrome()
    );
  }

  async initClient({initialize = true} = {}) {
    const settings = Object.assign({}, this.settings);

    this.client = NightwatchClient.create(settings, this.argv);
    if (initialize) {
      await this.client.initialize();
    }

    if (this.validateNightwatchInspectorCriteria()) {
      this.globalsInstance.inspectorServer?.closeSocket();
      this.globalsInstance.inspectorServer = new NightwatchInspectorServer(this.client);
    }
  }

  updateClient() {
    // this is necessary because mocha as a different suite setup flow
    if (!this.settings.disable_global_apis) {
      Object.defineProperty(global, 'browser', {
        configurable: true,
        get: function() {
          return this.client.api;
        }.bind(this)
      });
    }

    if (this.settings.sync_test_names) {
      this.client.mergeCapabilities({
        name: this.suiteName
      });
    }

    if (this.context.getDesiredCapabilities()) {
      this.client.mergeCapabilities(this.context.getDesiredCapabilities());
    }

    this.client.createTransport();

    if (!this.isE2EPreviewMode()) {
      this.createReporter();

      this.client
        .setReporter(this.reporter)
        .setCurrentTest();
    }

    return this;
  }

  async retrySuite() {
    this.suiteRetries.incrementSuiteRetriesCount();

    await this.terminate('RETRY_SUITE');

    await this.createContext({reloadModuleCache: this.context.usingBddDescribe});
    await this.createClient();
    this.setupHooks();

    return this.run();
  }

  createReporter() {
    if (!this.context) {
      throw new Error('Context must be created before creating the reporter.');
    }

    const {suiteRetries, suiteName} = this;
    const {tests, moduleKey, modulePath, groupName, skippedTests, allScreenedTests} = this.context;

    this.reporter = new Reporter({
      settings: this.client.settings,
      tests,
      suiteRetries,
      addOpts: {
        reporter: this.argv.reporter,
        suiteName,
        moduleKey,
        modulePath,
        reportPrefix: '',
        reportFileName: this.argv['report-filename'],
        groupName,
        isMobile: this.client.api.isMobile(),
        tags: this.context.getTags()
      },
      skippedTests,
      allScreenedTests
    });
  }

  async createClient(client = null) {
    if (client) {
      this.client = client;

      return this;
    }

    await this.initClient();
    this.updateClient();

    return this;
  }

  async createContext({context = null, reloadModuleCache = false, suiteTitle = null, attributes = {}} = {}) {
    if (context) {
      this.context = context;

      return this;
    }

    const {modulePath, settings, argv, client} = this;
    this.context = new Context({modulePath, settings, argv, attributes});

    if (settings.tag_filter && settings.tag_filter.length > 0) {
      reloadModuleCache = true;
    }

    this.context.setReloadModuleCache(reloadModuleCache);

    await this.context.init({usingMocha: this.usingMocha, suiteTitle, client});

    this.context.setReportKey(this.allModulePaths);

    return this;
  }

  addPropertiesToGlobalScope() {
    if (this.settings.disable_global_apis) {
      return null;
    }

    Object.defineProperty(global, 'app', {
      configurable: true,
      get: function() {
        return global.browser;
      }
    });

    Object.defineProperty(global, 'by', {
      configurable: true,
      get: function() {
        return By;
      }
    });

    Object.defineProperty(global, 'By', {
      configurable: true,
      get: function() {
        return By;
      }
    });

    Object.defineProperty(global, 'locateWith', {
      configurable: true,
      get: function() {
        return locateWith;
      }
    });

    Object.defineProperty(global, 'withTagName', {
      configurable: true,
      get: function() {
        return withTagName;
      }
    });

    Object.defineProperty(global, 'Keys', {
      configurable: true,
      get: function() {
        return Key;
      }
    });

    Object.defineProperty(global, 'element', {
      configurable: true,
      value: function(locator, options = {}) {
        return ElementGlobal.element({locator, testSuite: this, options, client: this.client});
      }.bind(this),
      writable: false
    });

    if (this.settings.disable_global_expect) {
      return null;
    }

    const globalExpect = function(...args) {
      return global.browser.expect(...args);
    };

    Object.defineProperty(globalExpect, 'element', {
      value: function(...args) {
        return global.browser.expect.element(...args);
      },
      writable: false
    });

    Object.defineProperty(globalExpect, 'elements', {
      value: function(...args) {
        return global.browser.expect.elements(...args);
      },
      writable: false
    });

    Object.defineProperty(globalExpect, 'component', {
      value: function(...args) {
        return global.browser.expect.component(...args);
      },
      writable: false
    });

    Object.defineProperty(globalExpect, 'title', {
      value: function(...args) {
        return global.browser.expect.title(...args);
      },
      writable: false
    });

    Object.defineProperty(globalExpect, 'cookie', {
      value: function(...args) {
        return global.browser.expect.cookie(...args);
      },
      writable: false
    });

    Object.defineProperty(globalExpect, 'url', {
      value: function(...args) {
        return global.browser.expect.url(...args);
      },
      writable: false
    });
    Object.freeze(globalExpect);

    Object.defineProperty(global, 'expect', {
      configurable: true,
      get: function() {
        return globalExpect;
      }
    });
  }

  setUncaughtError(err) {
    this.uncaughtError = err;
  }

  setReportPrefix(data) {
    this.settings.report_prefix = this.__reportPrefix = '';

    if (!data) {
      return this;
    }

    const capabilities = data.capabilities || {};
    const browserName = (capabilities.browserName && capabilities.browserName.toUpperCase()) || '';
    const browserVersion = capabilities.version || capabilities.browserVersion || '';
    const platformVersion = capabilities.platform || capabilities.platformVersion || '';

    if (!this.context.unitTestingMode) {
      this.settings.report_prefix = this.__reportPrefix = `${browserName}_${browserVersion}_${platformVersion}_`.replace(/ /g, '_');
    }

    this.reporter.setFileNamePrefix(this.reportPrefix);

    return this;
  }

  setRetries() {
    if (this.isE2EPreviewMode()) {
      return this;
    }

    this.suiteRetries = new SuiteRetries({
      retries: this.context.retries.testcase || this.argv.retries,
      suiteRetries: this.context.retries.suite || this.argv.suiteRetries
    });

    return this;
  }

  setSuiteName() {
    if (this.isE2EPreviewMode()) {
      this.suiteName = 'Preview';
    } else {
      this.suiteName = this.context.getSuiteName();
    }

    return this;
  }

  /**
   * Instantiates the test hooks
   *
   * @return {TestSuite}
   */
  setupHooks() {
    this.hooks = new TestHooks(this.context, {
      asyncHookTimeout: this.settings.globals.asyncHookTimeout
    });

    return this;
  }

  runHook(hookName) {
    Logger.log(`${Logger.colors.green('→')} Running [${hookName}]:`);

    if (this.context.hasHook(hookName)) {
      NightwatchEventHub.emit(TestSuiteHook[hookName].started, this.reporter.testResults.eventDataToEmit);
    }

    if (hookName === 'beforeEach' || hookName === 'afterEach') {
      this.client.reporter.markHookRun(hookName);
    }

    if (hookName === 'before' || hookName === 'after') {
      this.client.reporter.setCurrentSection({testName: `__${hookName}_hook`});
    }

    return this.handleRunnable(hookName, () => {
      return this.hooks[hookName].run(this.client);
    }).then(result => {
      if (this.context.hasHook(hookName)) {
        NightwatchEventHub.emit(TestSuiteHook[hookName].finished, this.reporter.testResults.eventDataToEmit);
      }

      if (hookName === 'beforeEach' || hookName === 'afterEach') {
        this.client.reporter.unmarkHookRun(hookName);
      }

      Logger.log(`${Logger.colors.green('→')} Completed [${hookName}].`);

      return result;
    });
  }

  runGlobalHook(hookName) {
    const {globals} = this.settings;

    if (globals[hookName]) {
      NightwatchEventHub.emit(GlobalHook[hookName].started, this.reporter.testResults.eventDataToEmit);
    }

    if (!this.globalHooks[hookName]) {
      return Promise.resolve();
    }

    this.client.reporter.setCurrentSection({testName: `__global_${hookName}_hook`});

    return this.handleRunnable(hookName, async () => {
      if (this.globalsInstance) {
        await this.globalsInstance.runPluginHook(hookName, [this.settings]);
      }

      const result = await this.globalHooks[hookName].run(this.client);

      if (globals[hookName]) {
        NightwatchEventHub.emit(GlobalHook[hookName].finished, this.reporter.testResults.eventDataToEmit);
      }

      this.onTestSectionFinished();

      return result;
    });
  }

  createSession() {
    if (this.client.sessionId || this.context.unitTestingMode) {
      return Promise.resolve();
    }

    const {argv, reuseBrowser} = this;
    const {moduleKey} = this.context;

    return this.client.createSession({argv, moduleKey, reuseBrowser}).catch(err => {
      err.sessionCreate = true;

      this.reporter.registerTestError(err);

      throw err;
    });
  }

  async startTestSuite() {
    NightwatchEventHub.emit(TestSuiteHook.started, this.reporter.testResults.eventDataToEmit);

    if (!this.client) {
      await this.createClient();
      this.setupHooks();
    }

    return this.createSession()
      .then(data => {
        this.setReportPrefix(data);
        // Adding session info to report
        if (data) {
          this.reporter.setSessionInfo(data);

          if (data.capabilities && data.capabilities['safari:deviceUDID']) {
            this.settings.deviceUDID = data.capabilities['safari:deviceUDID'];
          }
        }

        this.commandQueue.tree.on('asynctree:command:finished', this.onCommandFinished.bind(this));

        return this.runGlobalHook('beforeEach');
      });
  }

  /**
   * Runs the test suite, including all hooks
   */
  runTestSuite() {
    if (this.isE2EPreviewMode()) {
      return this.createSession()
        .then(_ => {
          const runnable = new Runnable('preview', _ => {
            const url = isString(this.argv.preview) ? this.argv.preview : this.api.launchUrl;
            this.api.url(url).pause();
          });

          return runnable.run(this.commandQueue);
        })
        .then(_ => this.stopSession());
    }

    return this.startTestSuite()
      .then(() => this.runHook('before'))
      .then(result => {
        this.onTestSectionFinished();

        if (result instanceof Error) {
          Logger.error(result);
        }

        return this.runNextTestCase();
      })
      .catch(err => {
        if (err.sessionCreate) {
          throw err;
        }

        if (!this.isAssertionError(err) && !this.context.unitTestingMode && !this.failFastMode) {
          if (!this.shouldSkipTestsOnFail()){
            Logger.error(err);
          }
          err.displayed = true;
        }

        // testcase failed - this catch ensures that the after hook is being called
        return err;
      })
      .then(possibleError => {
        this.reporter.resetCurrentTestName();

        return this.runHook('after')
          .catch(err => {
            // exceptions from after hook
            if (!possibleError) {
              possibleError = err;
            }

            return err;
          })
          .then(result => {
            if ((possibleError instanceof Error) && this.failFastMode) {
              throw possibleError;
            }
            this.onTestSectionFinished();

            return result;
          });
      })
      .catch(err => {
        // testsuite failed - this catch ensures that the global afterEach will always run
        return this.terminate('FAILED', err);
      })
      .then((errorOrFailures) => this.onTestSuiteFinished(errorOrFailures));
  }

  onTestSectionFinished() {
    // called for all test cases and hooks (except for [before|after]_each hooks)
    // ^ [before|after]_each hooks are considered part of the test case itself
    this.reporter.setTestStatus();
    this.reporter.setTestSectionElapsedTime();
    this.reporter.collectTestSectionOutput();
  }

  onTestSuiteFinished(errorOrFailures = false) {
    this.__snapShot = undefined;

    return this.runGlobalHook('afterEach')
      .then(result => {
        if (!(errorOrFailures instanceof Error)) {
          return result;
        }

        if ((errorOrFailures.sessionCreate && this.failFastMode)) {
          //throw errorOrFailures;
        }

        if (this.failFastMode && !this.shouldRetrySuite(errorOrFailures)) {
          throw errorOrFailures;
        }
      })
      .catch(err => {
        if (err.sessionCreate || this.failFastMode) {
          throw err;
        }

        if (!err.displayed) {
          Logger.error(err);
        }

        // catching errors thrown inside the global afterEach
        return err;
      })
      .then(failedResult => {
        if (this.shouldRetrySuite(errorOrFailures)) {
          return this.retrySuite();
        }

        const failures = errorOrFailures || failedResult || !this.reporter.allTestsPassed;

        return this.stopSession(failures);
      });
  }

  onCommandFinished({node, result}) {
    this.reporter.logCommandResult({node, result});
    this.takeSnapshot(node);
  }

  async stopSession(failures) {
    try {
      await this.terminate(failures ? 'FAILED' : '');
    } catch (err) {
      Logger.error(`Could not stop session in ${this.suiteName}:`);
      Logger.error(err);
    }

    return this.testSuiteFinished(failures);
  }

  sendReportToParentWorker() {
    if (this.settings.use_child_process && typeof process.send === 'function') {
      process.send(SafeJSON.stringify({
        type: 'testsuite_finished',
        itemKey: process.env.__NIGHTWATCH_ENV_LABEL,
        results: this.reporter.exportResults(),
        httpOutput: Logger.collectOutput()
      }));
    } else if (process.port && typeof process.port.postMessage === 'function') {
      process.port.postMessage(SafeJSON.stringify({
        type: 'testsuite_finished',
        results: this.reporter.exportResults(),
        httpOutput: Logger.collectOutput()
      }));
    }
  }

  testSuiteFinished(failures) {
    this.reporter.testSuiteFinished();
    this.currentRunnable = null;

    if (Concurrency.isWorker()) {
      this.sendReportToParentWorker();
    }

    NightwatchEventHub.emit(TestSuiteHook.finished, this.reporter.testResults.eventDataToEmit);

    return failures;
  }

  async sessionFinished(reason) {
    let lastError = null;

    if (reason === 'FAILED' || reason === 'RETRY_SUITE') {
      lastError = this.reporter.testResults.lastError;
    }

    await this.transport.sessionFinished(reason, lastError);
  }

  async terminate(reason = 'SIGINT', potentialError = null, endSession = !this.reuseBrowser) {
    this.resetQueue();

    if (!this.client.sessionId || this.context.unitTestingMode) {
      try {
        await this.sessionFinished(reason);
      } catch (err) {
        return err;
      }

      return potentialError;
    }

    if (!this.endSessionOnFail && reason === 'FAILED') {

      // Keep the session open; avoid reusing of same session
      Transport.driver = null;
      Transport.driverService = null;

      return potentialError;
    }


    if (endSession) {
      const runnable = new Runnable('terminate', _ => {
        if (this.api && isFunction(this.api.end)) {
          this.api.end(endSession);
        }
      }, {
        isES6Async: this.isES6Async
      });

      return runnable
        .run(this.commandQueue)
        .then(async result => {
          try {
            await this.sessionFinished(reason);
          } catch (err) {
            return err;
          }

          return result;
        })
        .then(result => {
          if ((potentialError instanceof Error) && (potentialError.sessionCreate || this.failFastMode)) {
            return potentialError;
          }

          return result;
        });
    }
  }

  setReporterCurrentTest() {
    // called for every test case (not for hooks)
    this.reporter.setCurrentTest(this.testcase, this.context);
    this.client.setCurrentTest();

    return this;
  }

  /**
   * Sets the next testcase and starts running it, if there is one
   *
   * @return {Promise}
   */
  runNextTestCase() {
    const nextTestCase = this.context.getNextKey();

    if (nextTestCase) {
      return this.runCurrentTest(nextTestCase);
    }

    return Promise.resolve();
  }

  /**
   * Runs the current testcase, including retries
   *
   * @param testName
   * @return {Promise}
   */
  runCurrentTest(testName) {
    const {reporter, context, settings} = this;

    this.testcase = new TestCase(testName, {
      context,
      settings,
      reporter,
      addtOpts: {
        retriesCount: this.suiteRetries.testRetriesCount[testName],
        maxRetries: this.suiteRetries.testMaxRetries
      }
    });

    this.setReporterCurrentTest().emptyQueue();

    return this.createSession()
      .then(() => this.runHook('beforeEach'))
      .then(_ => {
        this.client.reporter.markHookRun('testcase');

        NightwatchEventHub.emit(TestSuiteHook.test.started, {
          ...this.reporter.testResults.eventDataToEmit,
          testcase: this.reporter.testResults.currentTestName
        });

        return this.handleRunnable(this.testcase.testName, () => this.testcase.run(this.client));
      })
      .catch(err => {
        return err;
      })
      .then(possibleError => {
        this.client.reporter.unmarkHookRun();

        NightwatchEventHub.emit(TestSuiteHook.test.finished, {
          ...this.reporter.testResults.eventDataToEmit,
          testcase: this.reporter.testResults.currentTestName
        });

        if (this.transport.driverService && this.reporter.testResults) {
          this.reporter.testResults.setSeleniumLogFile(this.transport.driverService.getSeleniumOutputFilePath());
        }

        // if there was an error in the testcase and skip_testcases_on_fail, we must send it forward, but after we run afterEach and after hooks
        return this.runHook('afterEach')
          .then(() => this.testCaseFinished())
          .then(() => possibleError);
      })
      .then(possibleError => {
        if (this.shouldRetryTestCase()) {
          return this.retryCurrentTestCase();
        }

        if ((possibleError instanceof Error) && this.shouldSkipTestsOnFail()) {
          throw possibleError;
        }

        return this.runNextTestCase();
      });
  }

  testCaseFinished() {
    this.reporter.setElapsedTime();
    this.onTestSectionFinished();

    if (!this.testcase) {
      return Promise.resolve();
    }

    return this.reporter.printTestResult();
  }

  shouldRetryTestCase() {
    return !this.reporter.currentTestCasePassed && this.suiteRetries.shouldRetryTest(this.testcase.testName);
  }

  retryCurrentTestCase() {
    const currentTestName = this.testcase.testName;
    this.suiteRetries.incrementTestRetriesCount(currentTestName);
    this.reporter.resetCurrentTestPassedCount();
    this.reporter.testResults.retryTest = true;
    this.commandQueue.clearScheduled();

    return this.runCurrentTest(currentTestName);
  }

  isScreenshotEnabled() {
    return this.settings.screenshots.enabled;
  }

  shouldTakeScreenshotOnError() {
    return this.isScreenshotEnabled() && this.settings.screenshots.on_error;
  }

  shouldTakeScreenshotOnFailure() {
    return this.isScreenshotEnabled() && this.settings.screenshots.on_failure;
  }

  getScreenshotFilenamePath() {
    return Screenshots.getFileName({
      testSuite: this.api.currentTest.module,
      testCase: this.api.currentTest.name
    }, this.settings.screenshots);
  }

  takeScreenshot() {
    const fileNamePath = this.getScreenshotFilenamePath();
    const runnable = new Runnable('screenshot', _ => {
      return new Promise((resolve) => {
        this.api.saveScreenshot(fileNamePath, (result, err) => {
          if (!err && this.transport.isResultSuccess(result))  {
            const assertions = this.api.currentTest.results.assertions || [];
            const commands = this.reporter.currentSection.commands || [];

            if (assertions.length > 0) {
              const currentAssertion = assertions[assertions.length - 1];
              const currentCommand = commands[commands.length - 1];

              if (currentAssertion) {
                currentAssertion.screenshots = currentAssertion.screenshots || [];
                currentAssertion.screenshots.push(fileNamePath);
              }

              if (currentCommand) {
                currentCommand.screenshot = fileNamePath;
              }
            }
          } else {
            Logger.warn('Error saving screenshot...', err || result);
          }
          resolve();
        });
      });
    });

    return runnable.run(this.commandQueue);
  }

  takeSnapshot(node) {
    const commands = this.reporter.currentSection.commands || [];
    const currentCommand = commands[commands.length - 1];

    if (this.settings.trace.enabled && node.isTraceable) {
      const snapShotPath = Snapshots.getFileName({
        testSuite: this.api.currentTest.module,
        commandName: node.fullName,
        traceSettings: this.settings.trace,
        output_folder: this.settings.output_folder
      });

      this.__snapShot = new Promise((resolve, reject) => {
        this.api.saveSnapshot(snapShotPath, (result => {
          if (currentCommand) {
            currentCommand.domSnapshot = result;
          }
          resolve(result);
        }));
      });
    } else {
      if (currentCommand && this.__snapShot) {
        this.__snapShot.then(prevSnapshot => {
          currentCommand.domSnapshot = prevSnapshot;
        });
      }
    }
  }

  shouldRetrySuite(failures = false) {
    if ((failures instanceof Error) && alwaysDisplayError(failures)) {
      return false;
    }

    return (failures || !this.reporter.allTestsPassed) && this.suiteRetries.shouldRetrySuite();
  }

  async executeRunnable(name, fn) {
    this.currentRunnable = new Runnable(name, fn, {
      isES6Async: this.isES6Async
    });

    if (!this.context) {
      return;
    }

    this.context.setCurrentRunnable(this.currentRunnable);

    try {
      const result = await this.currentRunnable.run(this.commandQueue);

      return result;
    } catch (err) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(err);
        }, 50);
      });
    }

  }

  async handleRunnable(name, fn) {
    try {
      const result = await this.executeRunnable(name, fn);

      return result;
    } catch (err) {
      // if some other error was thrown, jump to the next catch
      err.name = err.name || '';
      if (!this.isAssertionError(err) && err.name !== 'TypeError') {
        // registering non-assert errors
        this.reporter.registerTestError(err);

        if (this.shouldTakeScreenshotOnError()) {
          await this.takeScreenshot();
        }

        throw err;
      }

      // if the assertion error was thrown by another assertion library
      if (!(err instanceof NightwatchAssertError)) {
        const failureMessage = `expected "${err.expected}" but got: "${err.actual}"`;
        if (err.actual !== undefined && err.expected !== undefined) {
          err.message += ` - ${failureMessage}`;
        }

        Logger.error(err);
        this.reporter.registerFailed(err);
        this.reporter.logAssertResult({
          name: err.name,
          message: err.message,
          stackTrace: err.stack,
          fullMsg: err.message,
          failure: failureMessage
        });
      }

      if (this.shouldTakeScreenshotOnFailure()) {
        await this.takeScreenshot();
      }
      // clearing the queue here to avoid continuing with the rest of the testcase,
      // unless abortOnFailure is set to false
      if (!this.isAssertionError(err) || err.abortOnFailure) {
        this.emptyQueue();
      }

      // set to true inside before/beforeEach hooks
      if (err.skipTestCases) {
        throw err;
      }

      return err;
    }
  }

  print() {
    if (this.isE2EPreviewMode()) {
      Logger.info('Previewing...');

      return this;
    }

    if (this.settings.output) {
      let testSuiteDisplay;
      const retriesCount = this.suiteRetries.suiteRetriesCount;

      if (this.context.unitTestingMode) {
        testSuiteDisplay = this.context.moduleName || this.context.moduleKey;
      } else {
        testSuiteDisplay = `[${this.suiteName}] Test Suite`;
      }

      if (this.settings.test_workers && !this.settings.live_output || this.context.unitTestingMode) {
        // eslint-disable-next-line no-console
        console.log('');
      }

      if (retriesCount > 0) {
        // eslint-disable-next-line no-console
        console.log('\nRetrying: ', Logger.colors.red(testSuiteDisplay), `(${retriesCount}/${this.suiteRetries.suiteMaxRetries}): `);
      } else if (this.context.unitTestingMode) {
        // eslint-disable-next-line no-console
        (this.context.isDisabled() ? Logger.info : console.log)(Logger.colors.cyan('[' + this.context.moduleKey + ']'));
      } else {
        Logger[this.context.isDisabled() ? 'info' : 'logDetailedMessage'](`\n${Logger.colors.cyan(testSuiteDisplay)}`);
      }

      if (!this.context.unitTestingMode) {
        Logger[this.context.isDisabled() ? 'info' : 'logDetailedMessage'](Logger.colors.purple(new Array(Math.min(testSuiteDisplay.length * 2 + 1, 80)).join('─')));
      }
    }

    return this;
  }

  resetQueue() {
    if (!this.commandQueue) {
      return this;
    }

    this.commandQueue.reset().removeAllListeners();

    return this;
  }

  emptyQueue() {
    this.resetQueue();

    if (this.commandQueue) {
      this.commandQueue.empty();
    }

    return this;
  }

  /**
   *
   * @return {*}
   */
  run() {
    this.print();

    if (this.context.isDisabled()) {
      // eslint-disable-next-line no-console
      console.log(Logger.colors.green(`Testsuite "${this.context.moduleName}" is disabled, skipping...`));

      // send report even if test is skipped
      if (Concurrency.isWorker()) {
        this.sendReportToParentWorker();
      }

      return Promise.resolve();
    }

    return this.runTestSuite();
  }

  isAssertionError(err) {
    return (err instanceof AssertionError) || err.name.startsWith('AssertionError');
  }
}



module.exports = TestSuite;
module.exports.Context = Context;
