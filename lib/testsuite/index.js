const AssertionError = require('assertion-error');
const Reporter = require('../reporter');
const Context = require('./context.js');
const TestHooks = require('./hooks.js');
const TestCase = require('./testcase.js');
const Runnable = require('./runnable.js');
const NightwatchAssertError = require('../assertion').AssertionError;
const SuiteRetries = require('./retries.js');
const Nightwatch = require('../index.js');
const Concurrency = require('../runner/concurrency/concurrency.js');
const {Logger, Screenshots} = require('../utils');

class TestSuite {
  constructor({modulePath, modules, settings, argv, addtOpts = {}}) {
    this.settings = settings;
    this.argv = argv;
    this.modulePath = modulePath;
    this.allModulePaths = modules;
    this.testcase = null;
    this.currentRunnable = null;

    this.globalHooks = addtOpts.globalHooks || {};
    this.__reportPrefix = '';
  }

  get api() {
    return this.client.api;
  }

  get commandQueue() {
    return this.client.session.commandQueue;
  }

  get reportPrefix() {
    return this.__reportPrefix;
  }

  get skipTestcasesOnFail() {
    let localDefinedValue = this.context.getSkipTestcasesOnFail();

    if (localDefinedValue !== undefined) {
      return localDefinedValue;
    }

    let settingsValueUndefined = this.settings.skip_testcases_on_fail === undefined;
    if (settingsValueUndefined && this.context.unitTestsMode) {
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

  init() {
    this.createContext();
    this.setSuiteName();
    this.setRetries();
    this.createClient();
    this.setupHooks();

    return this;
  }

  createContext({context = null, reloadModuleCache = false} = {}) {
    if (context) {
      this.context = context;

      return this;
    }

    const {modulePath, settings, argv} = this;
    this.context = new Context({modulePath, settings, argv});

    if (settings.tag_filter && settings.tag_filter.length > 0) {
      reloadModuleCache = true;
    }

    this.context
      .setReloadModuleCache(reloadModuleCache)
      .init()
      .setReportKey(this.allModulePaths);

    return this;
  }

  createClient(client = null) {
    if (client) {
      this.client = client;

      return this;
    }

    const testSuiteSettings = Object.assign({}, this.settings);

    if (this.settings.sync_test_names) {
      testSuiteSettings.desiredCapabilities.name = this.suiteName;
    }

    if (this.context.getDesiredCapabilities()) {
      Object.assign(testSuiteSettings.desiredCapabilities, this.context.getDesiredCapabilities());
    }

    const {suiteRetries, suiteName} = this;
    const {tests, moduleKey, modulePath, groupName} = this.context;

    this.reporter = new Reporter({
      settings: testSuiteSettings,
      tests,
      suiteRetries,
      addOpts: {
        suiteName,
        moduleKey,
        modulePath,
        reportPrefix: '',
        groupName
      }
    });

    this.client = Nightwatch.client(testSuiteSettings, this.reporter, this.argv);
    this.client.setCurrentTest();

    return this;
  }

  setReportPrefix(data) {
    if (!data) {
      this.settings.report_prefix = this.__reportPrefix = '';

      return this;
    }

    let capabilities = data.capabilities || {};
    let browserName = (capabilities.browserName && capabilities.browserName.toUpperCase()) || '';
    let browserVersion = capabilities.version || capabilities.browserVersion || '';
    let platformVersion = capabilities.platform || capabilities.platformVersion || '';

    this.settings.report_prefix = this.__reportPrefix = `${browserName}_${browserVersion}_${platformVersion}_`.replace(/ /g, '_');

    if (this.context.unitTestsMode) {
      this.__reportPrefix = '';
    }

    this.reporter.setFileNamePrefix(this.reportPrefix);

    return this;
  }

  setRetries() {
    this.suiteRetries = new SuiteRetries({
      retries: this.context.retries.testcase || this.argv.retries,
      suiteRetries: this.context.retries.suite || this.argv.suiteRetries
    });

    return this;
  }

  setSuiteName() {
    this.suiteName = this.context.getSuiteName();

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
    if (this.client.sessionId || this.context.unitTestsMode) {
      return Promise.resolve();
    }

    return this.client.createSession(this.argv);
  }

  /**
   * Runs the test suite, including all hooks
   */
  runTestSuite() {
    return this.createSession()
      .catch(err => {
        err.sessionCreate = true;

        this.reporter.registerTestError(err);

        throw err;
      })
      .then(data => {
        this.setReportPrefix(data);

        return this.runGlobalHook('beforeEach');
      })
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

        if (!isAssertionError(err)) {
          Logger.error(err);
        }

        // testcase failed - this catch ensures that the after hook is being called
        return err;
      })
      .then(_ => {
        this.reporter.resetCurrentTestName();

        return this.runHook('after');
      })
      .catch(err => {
        if (err.code === 'ECONNREFUSED') {
          throw err;
        }

        if (!err.sessionCreate) {
          Logger.error(err);
        }

        // testsuite failed - this catch ensures that the global afterEach will always run
        return this.terminate('FAILED');
      })
      .then(_ => this.runGlobalHook('afterEach'))
      .catch(err => {
        if (err.sessionCreate) {
          throw err;
        }

        Logger.error(err);

        // catching errors thrown inside the global afterEach
        return true;
      })
      .then(failures => {
        if (this.shouldRetrySuite()) {
          return this.retrySuite();
        }

        return failures;
      })
      .then(async (failures) => {
        let testFailed = failures || !this.reporter.allTestsPassed;
        try {
          await this.terminate(testFailed ? 'FAILED' : '');
        } catch (err) {
          Logger.error(`Could not stop session in ${this.suiteName}:`);
          Logger.error(err);
        }

        return testFailed;
      })
      .then(testFailed => {
        return this.testSuiteFinished(testFailed);
      });

  }

  testSuiteFinished(failures) {
    this.reporter.testSuiteFinished();
    this.currentRunnable = null;

    if (Concurrency.isChildProcess() && typeof process.send == 'function') {
      process.send(JSON.stringify({
        type: 'testsuite_finished',
        itemKey: process.env.__NIGHTWATCH_ENV_LABEL,
        results: this.reporter.exportResults()
      }));
    } 
    this.client.transport.testSuiteFinished(failures);
    this.client.session.finished(failures ? 'FAILED' : '');
    

    return this;
  }

  terminate(reason = 'SIGINT') {
    this.resetQueue();

    if (!this.client.sessionId || this.context.unitTestsMode) {
      return Promise.resolve();
    }

    if (!this.endSessionOnFail && reason === 'FAILED') {
      return Promise.resolve();
    }

    const runnable = new Runnable('terminate', _ => {
      this.api.end();
    });

    return runnable.run(this.commandQueue);
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

        if ((possibleError instanceof Error) && this.skipTestcasesOnFail) {
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
          if (!err && this.client.transport.isResultSuccess(result))  {
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
  
  shouldRetrySuite() {
    return !this.reporter.allTestsPassed && this.suiteRetries.shouldRetrySuite();
  }

  async retrySuite() {
    this.suiteRetries.incrementSuiteRetriesCount();

    await this.terminate('RETRY_SUITE');

    this.createContext({reloadModuleCache: this.context.usingBddDescribe});
    this.createClient();
    this.setupHooks();

    return this.run();
  }

  createRunnable(name, fn) {
    this.currentRunnable = new Runnable(name, fn);
    this.context.setCurrentRunnable(this.currentRunnable);

    return this.currentRunnable.run(this.commandQueue);
  }

  async handleRunnable(name, fn) {
    try {
      await this.createRunnable(name, fn);
    } catch (err) {
      // if some other error was thrown, jump to the next catch
      err.name = err.name || '';
      if (!isAssertionError(err)) {
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
      if (!isAssertionError(err) || err.abortOnFailure) {
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
    if (this.settings.output) {
      let testSuiteDisplay;
      let retriesCount = this.suiteRetries.suiteRetriesCount;

      if (this.context.unitTestsMode) {
        testSuiteDisplay = this.context.moduleName || this.context.moduleKey;
      } else {
        testSuiteDisplay = `[${this.suiteName}] Test Suite`;
      }

      if (this.settings.test_workers && !this.settings.live_output || this.context.unitTestsMode) {
        // eslint-disable-next-line no-console
        console.log('');
      }

      if (retriesCount > 0) {
        // eslint-disable-next-line no-console
        console.log('\nRetrying: ', Logger.colors.red(testSuiteDisplay), `(${retriesCount}/${this.suiteRetries.suiteMaxRetries}): `);
      } else if (this.context.unitTestsMode) {
        // eslint-disable-next-line no-console
        (this.context.isDisabled() ? Logger.info : console.log)(Logger.colors.cyan('[' + this.context.moduleKey + ']'));
      } else {
        Logger[this.context.isDisabled() ? 'info': 'logDetailedMessage'](`\n${Logger.colors.cyan(testSuiteDisplay)}`);
      }

      if (!this.context.unitTestsMode) {
        Logger[this.context.isDisabled() ? 'info': 'logDetailedMessage'](Logger.colors.purple(new Array(testSuiteDisplay.length + 1).join('=')));
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

    this.commandQueue.empty();

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
}

function isAssertionError(err) {
  return (err instanceof AssertionError) || err.name.startsWith('AssertionError');
}

module.exports = TestSuite;
module.exports.Context = Context;
