const AssertionError = require('assertion-error');
const Reporter = require('../reporter');
const Context = require('./context.js');
const TestHooks = require('./hooks.js');
const TestCase = require('./testcase.js');
const Runnable = require('./runnable.js');
const NightwatchAssertError = require('../assertion').AssertionError;
const SuiteRetries = require('./retries.js');
const NightwatchClient = require('../core/client.js');
const Concurrency = require('../runner/concurrency');
const ElementGlobal = require('../api/_loaders/element-global.js');
const {Logger, Screenshots, alwaysDisplayError, isString, isFunction} = require('../utils');
const {By, Key, locateWith, withTagName} = require('selenium-webdriver');

class TestSuite {
  constructor({modulePath, modules, settings, argv, usingMocha = false, addtOpts = {}}) {
    this.settings = settings;
    this.argv = argv;
    this.modulePath = modulePath;
    this.allModulePaths = modules;
    this.testcase = null;
    this.currentRunnable = null;
    this.usingMocha = usingMocha;

    this.globalHooks = addtOpts.globalHooks || {};
    this.__reportPrefix = '';
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
    let localDefinedValue = this.context.getSkipTestcasesOnFail();

    if (localDefinedValue !== undefined) {
      return localDefinedValue;
    }

    let settingsValueUndefined = this.settings.skip_testcases_on_fail === undefined;
    if (settingsValueUndefined && this.context.unitTestingMode) {
      // false by default when running unit tests
      return false;
    }

    // true by default when not running unit tests
    return settingsValueUndefined || this.settings.skip_testcases_on_fail;
  }

  get endSessionOnFail() {
    let definedValue = this.context.getEndSessionOnFail();

    return definedValue === undefined ? this.settings.end_session_on_fail : definedValue;
  }

  get isES6Async() {
    return this.client && (this.client.isES6AsyncTestcase || this.client.isES6AsyncTestHook);
  }

  get failFastMode() {
    return this.argv['fail-fast'] || this.settings.enable_fail_fast;
  }

  shouldSkipTestsOnFail() {
    return this.skipTestcasesOnFail && !this.context.unitTestingMode || this.failFastMode;
  }

  async initCommon(opts = {}) {
    if (!this.settings.unit_testing_mode) {
      this.addPropertiesToGlobalScope();
    }

    this.initClient(opts);

    if (this.argv.preview) {
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

  initClient({initialize = true} = {}) {
    const settings = Object.assign({}, this.settings);

    this.client = NightwatchClient.create(settings, this.argv);
    if (initialize) {
      this.client.initialize();
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

    if (!this.argv.preview) {
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
    this.createClient();
    this.setupHooks();

    return this.run();
  }

  createReporter() {
    if (!this.context) {
      throw new Error('Context must be created before creating the reporter.');
    }

    const {suiteRetries, suiteName} = this;
    const {tests, moduleKey, modulePath, groupName} = this.context;

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
        groupName
      }
    });
  }

  createClient(client = null) {
    if (client) {
      this.client = client;

      return this;
    }

    this.initClient();
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
        return ElementGlobal.element({locator, testSuite: this, options});
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
        return this.expect.cookie(...args);
      },
      writable: false
    });

    Object.defineProperty(globalExpect, 'url', {
      value: function(...args) {
        return this.expect.url(...args);
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

    let capabilities = data.capabilities || {};
    let browserName = (capabilities.browserName && capabilities.browserName.toUpperCase()) || '';
    let browserVersion = capabilities.version || capabilities.browserVersion || '';
    let platformVersion = capabilities.platform || capabilities.platformVersion || '';

    if (!this.context.unitTestingMode) {
      this.settings.report_prefix = this.__reportPrefix = `${browserName}_${browserVersion}_${platformVersion}_`.replace(/ /g, '_');
    }

    this.reporter.setFileNamePrefix(this.reportPrefix);

    return this;
  }

  setRetries() {
    if (this.argv.preview) {
      return this;
    }

    this.suiteRetries = new SuiteRetries({
      retries: this.context.retries.testcase || this.argv.retries,
      suiteRetries: this.context.retries.suite || this.argv.suiteRetries
    });

    return this;
  }

  setSuiteName() {
    if (this.argv.preview) {
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

    return this.handleRunnable(hookName, () => {
      return this.hooks[hookName].run(this.client);
    }).then(result => {
      Logger.log(`${Logger.colors.green('→')} Completed [${hookName}].`);

      return result;
    });
  }

  runGlobalHook(hookName) {
    if (!this.globalHooks[hookName]) {
      return Promise.resolve();
    }

    return this.handleRunnable(hookName, () => {
      return this.globalHooks[hookName].run(this.client);
    });
  }

  createSession() {
    if (this.client.sessionId || this.context.unitTestingMode) {
      return Promise.resolve();
    }

    const {argv} = this;
    const {moduleKey} = this.context;

    return this.client.createSession({argv, moduleKey}).catch(err => {
      err.sessionCreate = true;

      this.reporter.registerTestError(err);

      throw err;
    });
  }

  startTestSuite() {
    if (!this.client) {
      this.createClient().setupHooks();
    }

    return this.createSession()
      .then(data => {
        this.setReportPrefix(data);

        return this.runGlobalHook('beforeEach');
      });
  }

  /**
   * Runs the test suite, including all hooks
   */
  runTestSuite() {
    if (this.argv.preview) {
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
          Logger.error(err);
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

            return result;
          });
      })
      .catch(err => {
        // testsuite failed - this catch ensures that the global afterEach will always run
        return this.terminate('FAILED', err);
      })
      .then((errorOrFailures) => this.onTestSuiteFinished(errorOrFailures));
  }

  onTestSuiteFinished(errorOrFailures = false) {
    return this.runGlobalHook('afterEach')
      .then(result => {
        if (!(errorOrFailures instanceof Error)) {
          return result;
        }

        if ((errorOrFailures.sessionCreate && this.failFastMode)) {
          //throw errorOrFailures;
        }

        if (this.failFastMode) {
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

        let failures = errorOrFailures || failedResult || !this.reporter.allTestsPassed;

        return this.stopSession(failures);
      });
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

  async testSuiteFinished(failures) {
    this.reporter.testSuiteFinished();
    this.currentRunnable = null;

    if (Concurrency.isChildProcess() && typeof process.send == 'function') {
      process.send(JSON.stringify({
        type: 'testsuite_finished',
        itemKey: process.env.__NIGHTWATCH_ENV_LABEL,
        results: this.reporter.exportResults()
      }));
    }

    try {
      let lastError = failures;
      if (lastError === true) {
        lastError = this.reporter.testResults.lastError;
      }
      await this.transport.testSuiteFinished(lastError);
    } catch (err) {
      Logger.error(`Unable to stop the test suite gracefully because of: [${err.name}]: ${err.message}`);
    }

    return failures;
  }

  async terminate(reason = 'SIGINT', potentialError = null) {
    this.resetQueue();

    if (!this.client.sessionId || this.context.unitTestingMode) {
      try {
        await this.transport.sessionFinished(reason);
      } catch (err) {
        return err;
      }

      return potentialError;
    }

    if (!this.endSessionOnFail && reason === 'FAILED') {
      return potentialError;
    }

    const runnable = new Runnable('terminate', _ => {
      if (this.api && isFunction(this.api.end)) {
        this.api.end();
      }
    }, {
      isES6Async: this.isES6Async
    });

    return runnable
      .run(this.commandQueue)
      .then(async result => {
        try {
          await this.transport.sessionFinished(reason);
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

  setReporterCurrentTest() {
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
        return this.handleRunnable(this.testcase.testName, () => this.testcase.run(this.client));
      })
      .catch(err => {
        return err;
      })
      .then(possibleError => {
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

    if (!this.testcase) {
      return Promise.resolve();
    }

    return this.reporter.printTestResult();
  }

  shouldRetryTestCase() {
    return !this.reporter.currentTestCasePassed && this.suiteRetries.shouldRetryTest(this.testcase.testName);
  }

  retryCurrentTestCase() {
    let currentTestName = this.testcase.testName;
    this.suiteRetries.incrementTestRetriesCount(currentTestName);
    this.reporter.resetCurrentTestPassedCount();
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

            if (assertions.length > 0) {
              const currentAssertion = assertions[assertions.length-1];

              if (currentAssertion) {
                currentAssertion.screenshots = currentAssertion.screenshots || [];
                currentAssertion.screenshots.push(fileNamePath);
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
  
  shouldRetrySuite(failures = false) {
    if ((failures instanceof Error) && alwaysDisplayError(failures)) {
      return false;
    }

    return (failures || !this.reporter.allTestsPassed) && this.suiteRetries.shouldRetrySuite();
  }

  createRunnable(name, fn) {
    this.currentRunnable = new Runnable(name, fn, {
      isES6Async: this.isES6Async
    });
    this.context.setCurrentRunnable(this.currentRunnable);

    return this.currentRunnable.run(this.commandQueue);
  }

  async handleRunnable(name, fn) {
    try {
      const result = await this.createRunnable(name, fn);

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

        this.reporter.logFailedAssertion(err);
        this.reporter.registerFailed(err);
        this.reporter.logAssertResult({
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
    if (this.argv.preview) {
      Logger.info('Previewing...');

      return this;
    }

    if (this.settings.output) {
      let testSuiteDisplay;
      let retriesCount = this.suiteRetries.suiteRetriesCount;

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
        Logger[this.context.isDisabled() ? 'info': 'logDetailedMessage'](`\n${Logger.colors.cyan(testSuiteDisplay)}`);
      }

      if (!this.context.unitTestingMode) {
        Logger[this.context.isDisabled() ? 'info': 'logDetailedMessage'](Logger.colors.purple(new Array(Math.min(testSuiteDisplay.length*2 + 1, 80)).join('─')));
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
