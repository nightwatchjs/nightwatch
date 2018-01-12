const EventEmitter = require('events');

const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const Context = require('./context.js');
const TestResults = require('./results.js');
const TestHooks = require('./hooks.js');
const TestCase = require('./testcase.js');
const SuiteRetries = require('./retries.js');
const Nightwatch = require('../index.js');

class Runnable {
  constructor(runFn) {
    this.setRunFn(runFn);
  }

  setQueue(queue) {
    this.queue = queue;

    return this;
  }

  /**
   *
   * @param {function} runFn
   */
  setRunFn(runFn) {
    this.runFn = runFn;

    return this;
  }

  run(queue) {
    this.setQueue(queue);

    return new Promise((resolve, reject) => {
      let result;

      try {
        result = this.runFn();
      } catch (err) {
        return reject(err);
      }


      this.queue.reset().run(err => {
        if (err) {
          return reject(err);
        }

        if (result instanceof Promise) {
          result
            .then(resolve)
            .catch(reject);
        } else {
          resolve();
        }
      });
    });
  }
}

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
    this.currentTest = '';
    this.testcase = null;

    this.createContext();
    this.createClient();
    this.setRetries();
    this.setSuiteName();
    this.createTestResults();
    this.setupHooks();
  }

  get api() {
    return this.client.api;
  }

  get commandQueue() {
    return this.client.session.commandQueue;
  }

  createContext() {
    this.context = new Context(this.modulePath, this.settings, this.addtOpts);
    this.context.setReportKey(this.allModulePaths);

    return this;
  }

  createTestResults() {
    this.testResults = new TestResults(this.context.tests);

    return this;
  }

  createClient() {
    this.client = Nightwatch.client(this.settings);

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
    this.print();

    return this.client.createSession()
      .then(data => {
        return this.runHook('before');
      })
      .catch(err => {
        // TODO: log results
        console.error('BEFORE ERR', err)
      })
      .then(_ => {
        return this.runNextTestCase();
      })
      .then(_ => {
        return this.runHook('after');
      })
      .catch(err => {
        // TODO: log results
        console.error('AFTER ERR', err)
      })
      .then(_ => {
        if (this.suiteRetries.shouldRetrySuite()) {
          this.suiteRetries.incrementSuiteRetriesCount();
        } else {
          this.client.session.close({
            reason: 'FINISHED'
          });
        }
      });
  }

  runHook(hookName) {
    let runnable = new Runnable(() => {
      return this.hooks[hookName].run(this.api);
    });

    return runnable.run(this.commandQueue);
  }

  /**
   * Sets the next testcase and starts running it, if there is one
   *
   * @return {Promise}
   */
  runNextTestCase() {
    let nextTestCase = this.context.getNextKey();

    if (nextTestCase) {
      this.currentTest = nextTestCase;

      return this.runCurrentTest();
    }

    return Promise.resolve();
  }

  /**
   * Runs the current testcase, including retries
   *
   * @return {Promise}
   */
  runCurrentTest() {
    this.testResults.setCurrentTest(this.currentTest);

    this.testcase = new TestCase(this.currentTest, this.context, this.settings, {
      retriesCount: this.suiteRetries.testRetriesCount,
      maxRetries: this.suiteRetries.testMaxRetries,
      parallelMode: this.addtOpts.parallelMode
    });

    this.resetQueue();
    this.testcase.print();

    return this.runHook('beforeEach')
      .catch(err => {
        // TODO: use skip_testcases_on_failure to figure out if the testcase run should go ahead
        throw err;
      })
      .then(_ => {
        let runnable = new Runnable(() => {
          return this.testcase.run(this.api);
        });

        return runnable.run(this.commandQueue);
      })
      .catch(err => {
        console.error('Test ERR', err);
        throw err;
      })
      .then(_ => {
        return this.runHook('afterEach')
      })
      .catch(err => {
        if (this.suiteRetries.shouldRetryTest()) {
          this.suiteRetries.incrementTestRetriesCount();

          return this.runCurrentTest();
        }

        throw err;
      })
      .then(_ => {
        return this.testCaseFinished();
      });

  }

  /**
   * @return {Promise}
   */
  testCaseFinished() {
    return this.runNextTestCase();
  }

  print() {
    if (this.settings.output) {
      let testSuiteDisplay;
      if (this.settings.start_session) {
        testSuiteDisplay = ` [${this.suiteName}] Test Suite`;
      } else {
        testSuiteDisplay = this.context.moduleName || this.context.moduleKey;
      }

      if (this.settings.test_workers && !this.settings.live_output) {
        process.stdout.write('\\n');
      }

      let output = `\n${Logger.colors.cyan(testSuiteDisplay)}\n ${Logger.colors.purple(new Array(testSuiteDisplay.length + 1).join('='))}`;
      console.log(output);
    }

    return this;
  }

  terminate(reason = 'SIGINT') {
    this.commandQueue.empty().removeAllListeners();

    return this.client.session.close({
      reason: reason
    });
  }

  resetQueue() {
    this.commandQueue.reset().removeAllListeners();

    return this;
  }

  /**
   *
   * @return {*}
   */
  run() {
    if (this.context.isDisabled()) {
      return Promise.resolve();
    }

    return this.runTestSuite();
  }
}

module.exports = TestSuite;