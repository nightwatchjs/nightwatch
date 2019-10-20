const GlobalReporter = require('../../reporter').GlobalReporter;
const TestSuite = require('../../testsuite/testsuite.js');
const Logger = require('../../util/logger.js');
const Concurrency = require('../concurrency/concurrency.js');

class DefaultRunner {
  get supportsConcurrency() {
    return true;
  }

  constructor(settings, argv, addtOpts) {
    this.startTime = new Date().getTime();
    this.settings = settings;
    this.argv = argv;
    this.addtOpts = addtOpts;
    this.publishReport = true; // in-case of an uncaught exception, the report will not be published
    this.globalReporter = new GlobalReporter(argv.reporter, settings);
  }

  get client() {
    return this.currentSuite && this.currentSuite.client;
  }

  get promise() {
    return this.__promise;
  }

  get results() {
    return this.globalReporter.globalResults;
  }

  registerUncaughtErr(err) {
    if (err instanceof TypeError && /\w is not a function$/.test(err.message)) {
      err.detailedErr = '- writing an ES6 async test case? - keep in mind that commands return a Promise; \n - writing unit tests? - make sure to specify "unit_tests_mode=true" in your config.';
    }

    this.globalReporter.registerUncaughtErr(err);
  }

  createPromise() {
    this.__promise = new Promise(this.promiseFn.bind(this));

    return this;
  }

  promiseFn(resolve, reject) {
    let sourcePath = this.modulePathsCopy.shift();

    this.runTestSuite(sourcePath, this.fullPaths)
      .then(() => {
        if (this.modulePathsCopy.length === 0) {
          resolve();
        } else {
          this.promiseFn(resolve, reject);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  }

  /**
   * @return {Promise}
   */
  closeOpenSessions() {
    if (this.client && this.client.sessionId && this.client.startSessionEnabled) {
      Logger.info(`Attempting to close session ${this.client.sessionId}...`);

      return this.currentSuite.terminate();
    }

    return Promise.resolve();
  }

  createTestSuite({modulePath, modules}) {
    const {settings, argv, addtOpts} = this;

    const testSuite = new TestSuite({modulePath, modules, settings, argv, addtOpts});
    testSuite.init();

    return testSuite;
  }

  async runTestSuite(modulePath, modules) {
    try {
      this.currentSuite = this.createTestSuite({modulePath, modules});
    } catch (err) {
      const Runner = require('../runner.js');
      throw Runner.createError(err);
    }

    let possibleErr;
    try {
      await this.currentSuite.run();
    } catch (err) {
      possibleErr = err;
    }

    this.globalReporter.addTestSuiteResults(this.currentSuite.reporter.exportResults());

    if (possibleErr instanceof Error) {
      throw possibleErr;
    }
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  async run(modules) {
    try {
      this.result = await this.runTests(modules)
    } catch (err) {
      this.globalReporter.registerUncaughtErr(err);
    }

    await this.closeOpenSessions();

    if (this.publishReport) {
      await this.reportResults();
    }

    return this.result;
  }

  /**
   * @param {Array} modules
   * @return {Promise}
   */
  runTests(modules) {
    this.modulePathsCopy = modules.slice(0);
    this.fullPaths = modules;

    this.createPromise();

    return this.promise;
  }

  printGlobalResults() {
    this.globalReporter.create(this.startTime).print();

    return this;
  }

  /**
   * @return {Promise<boolean>}
   */
  async reportResults() {
    if (!this.isTestWorker()) {
      this.printGlobalResults();
      await this.globalReporter.save();
    }

    return this.globalReporter.hasTestFailures();
  }

  /**
   *
   * @param {Array} testEnvArray
   * @param {Array} modules
   * @return {Promise<number>}
   */
  async runConcurrent(testEnvArray, modules) {
    this.concurrency = new Concurrency(this.settings, this.argv);
    this.globalReporter.setupChildProcessListener(this.concurrency);

    const exitCode = await this.concurrency.runMultiple(testEnvArray, modules);
    await this.reportResults();

    return exitCode;
  }

  isTestWorker() {
    return Concurrency.isChildProcess() && this.argv['test-worker'];
  }
}

module.exports = DefaultRunner;
