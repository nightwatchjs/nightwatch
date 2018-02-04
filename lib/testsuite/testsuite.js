const AssertionError = require('assertion-error');
const EventEmitter = require('events');
const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const Reporter = require('./reporter.js');
const Context = require('./context.js');
const TestHooks = require('./hooks.js');
const TestCase = require('./testcase.js');
const Runnable = require('./runnable.js');
const NightwatchAssertError = require('../core/assertion.js').AssertionError;
const SuiteRetries = require('./retries.js');
const Nightwatch = require('../index.js');

class TestSuite extends EventEmitter {
  static get expectedAsyncArgs() {
    return 1;
  }

  static get DEFAULT_ASYNC_HOOK_TIMEOUT() {
    return 10000;
  }

  constructor(modulePath, allModulePaths, settings, addtOpts) {
    super();

    this.settings = settings;
    this.addtOpts = addtOpts;
    this.modulePath = modulePath;
    this.allModulePaths = allModulePaths;
    this.testcase = null;
    this.currentRunnable = null;
    this.__reportPrefix = '';

    this.createContext();
    this.setSuiteName();
    this.createClient();
    this.setRetries();
    this.setupHooks();
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

  get currentPromise() {
    if (!this.currentRunnable) {
      return null;
    }

    return this.currentRunnable.currentPromise;
  }

  createContext() {
    this.context = new Context(this.modulePath, this.settings, this.addtOpts);
    this.context.setReportKey(this.allModulePaths);

    return this;
  }

  createClient() {
    this.client = Nightwatch.client(this.settings);
    this.reporter = new Reporter(this.context.tests, this.settings, {
      suiteName: this.suiteName,
      moduleKey: this.context.moduleKey,
      reporterPrefix: this.reportPrefix,
      groupName: this.context.groupName
    });

    this.client.setReporter(this.reporter).initialize();

    return this;
  }

  setReportPrefix(data) {
    let capabilities = data.capabilities || {};
    let browserName = (capabilities.browserName && capabilities.browserName.toUpperCase()) || '';
    let browserVersion = capabilities.version || capabilities.browserVersion;
    let platformVersion = capabilities.platform || capabilities.platformVersion;

    this.settings.report_prefix = this.__reportPrefix = `${browserName}_${browserVersion}_${platformVersion}_`.replace(/ /g, '_');

    return this;
  }

  setRetries() {
    this.suiteRetries = new SuiteRetries(this.addtOpts);

    return this;
  }

  setSuiteName() {
    this.suiteName = Utils.getTestSuiteName(this.context.moduleKey);

    return this;
  }

  /**
   * Instantiates the test hooks
   *
   * @return {TestSuite}
   */
  setupHooks() {
    this.hooks = new TestHooks(this.context, this.settings, {
      asyncHookTimeout: this.addtOpts.asyncHookTimeout || TestSuite.DEFAULT_ASYNC_HOOK_TIMEOUT
    });

    return this;
  }

  /**
   * Runs the test suite, including all hooks
   */
  runTestSuite() {
    return this.client.createSession()
      .catch(err => {
        // TODO: log results
        console.error('createSession ERR')
        throw err;
      })
      .then(data => {

        this.setReportPrefix(data);

        return this.runHook('before');
      })
      .then(_ => {
        return this.runNextTestCase();
      })
      .then(_ => {
        return this.runHook('after');
      })
      .then(_ => {
        return this.testSuiteFinished();
      })
      .catch(err => {
        // testsuite failed
        // TODO: implement suite retry
        if (this.suiteRetries.shouldRetrySuite()) {
          this.suiteRetries.incrementSuiteRetriesCount();
        } else {
          this.testCaseFinished();

          return this.testSuiteFinished().terminate('FAILED');
        }
      });
  }

  runHook(hookName) {
    return this.createRunnable(hookName, () => {
      return this.hooks[hookName].run(this.api);
    });
  }

  createRunnable(name, fn) {
    this.currentRunnable = new Runnable(name, fn);

    return this.currentRunnable.run(this.commandQueue).catch(err => {
      // if some other error was thrown, jump to the next catch
      if (!(err instanceof AssertionError)) {
        // registering non-assert errors
        this.reporter.registerTestError(err);

        throw err;
      }

      // if the assertion error was thrown by another assertion library
      if (!(err instanceof NightwatchAssertError)) {
        this.reporter.registerFailed(err);
      }

      if (this.suiteRetries.shouldRetryTest()) {
        this.suiteRetries.incrementTestRetriesCount();

        return this.runCurrentTest();
      }

      throw err;
    }).catch(err => {
      // clearing the queue here to avoid continuing with the rest of the testcase,
      // unless abortOnFailure is set to false
      if (!(err instanceof AssertionError) || err.abortOnFailure) {
        this.emptyQueue();
      }

      return err;
    }).then(err => {
      // skip other testcases from the current suite if skip_testcases_on_fail
      if (err instanceof Error && this.settings.skip_testcases_on_fail) {
        return err;
      }
    });
  }

  /**
   * Sets the next testcase and starts running it, if there is one
   *
   * @return {Promise}
   */
  runNextTestCase() {
    let nextTestCase = this.context.getNextKey();

    if (nextTestCase) {
      return this.runCurrentTest(nextTestCase);
    }

    return Promise.resolve();
  }

  setCurrentTest() {
    this.reporter.setCurrentTest(this.testcase, this.context);
    this.client.setApiProperty('currentTest', this.reporter.currentTest);

    return this;
  }

  /**
   * Runs the current testcase, including retries
   *
   * @param testName
   * @return {Promise}
   */
  runCurrentTest(testName) {
    this.testcase = new TestCase(testName, this.context, this.settings, {
      retriesCount: this.suiteRetries.testRetriesCount,
      maxRetries: this.suiteRetries.testMaxRetries,
      parallelMode: this.addtOpts.parallelMode
    });

    this.setCurrentTest().resetQueue();

    return this.runHook('beforeEach')
      .then(_ => {
        return this.createRunnable(this.testcase.testName, () => {
          return this.testcase.run(this.api);
        });
      })
      .then(_ => {
        return this.runHook('afterEach');
      })
      .then(_ => {
        return this.testCaseFinished().runNextTestCase();
      });
  }

  testSuiteFinished() {
    this.reporter.testSuiteFinished();
    this.currentRunnable = null;

    return this;
  }

  testCaseFinished() {
    this.reporter.setElapsedTime();

    return this.printTestResult();
  }

  printTestResult() {
    this.reporter.printTestResult();

    return this;
  }

  print() {
    if (this.settings.output) {
      let testSuiteDisplay;
      if (this.settings.start_session) {
        testSuiteDisplay = `[${this.suiteName}] Test Suite`;
      } else {
        testSuiteDisplay = this.context.moduleName || this.context.moduleKey;
      }

      if (this.settings.test_workers && !this.settings.live_output) {
        process.stdout.write('\\n');
      }

      let output = `\n${Logger.colors.cyan(testSuiteDisplay)}\n${Logger.colors.purple(new Array(testSuiteDisplay.length + 1).join('='))}`;
      console.log(output);
    }

    return this;
  }

  terminate(reason = 'SIGINT') {
    this.resetQueue();

    return this.client.session.close({
      reason: reason
    });
  }

  resetQueue() {
    this.commandQueue.reset().removeAllListeners();

    return this;
  }

  emptyQueue() {
    this.commandQueue.removeAllListeners().empty().reset();
  }

  /**
   *
   * @return {*}
   */
  run() {
    this.print();

    if (this.context.isDisabled()) {
      console.info(Logger.colors.cyan('Module is disabled, skipping...'));

      return Promise.resolve();
    }

    return this.runTestSuite();
  }
}

module.exports = TestSuite;