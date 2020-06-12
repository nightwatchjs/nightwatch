const GlobalReporter = require('../../reporter').GlobalReporter;
const TestSuite = require('../../testsuite');
const Concurrency = require('../concurrency/concurrency.js');
const {Logger} = require('../../utils');

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

  get results() {
    return this.globalReporter.globalResults;
  }

  get hasTestFailures() {
    return this.globalReporter.hasTestFailures();
  }

  registerUncaughtErr(err) {
    this.globalReporter.registerUncaughtErr(err);
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
   * @param {Array} modules
   * @return {Promise}
   */
  runTests(modules) {
    this.modulePathsCopy = modules.slice(0);
    this.fullPaths = modules;

    return new Promise(this.promiseFn.bind(this));
  }

  async promiseFn(resolve, reject) {
    const sourcePath = this.modulePathsCopy.shift();

    try {
      await this.runTestSuite(sourcePath, this.fullPaths);

      if (this.modulePathsCopy.length === 0) {
        resolve();
      } else {
        await this.promiseFn(resolve, reject);
      }
    } catch (err) {
      reject(err);
    }
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
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  async run(modules) {
    let possibleErr;
    try {
      await this.runTests(modules)
    } catch (err) {
      possibleErr = err;
      this.globalReporter.registerUncaughtErr(err);
    }

    await this.closeOpenSessions();

    if (this.publishReport) {
      await this.reportResults();
    }

    if (possibleErr) {
      throw possibleErr;
    }

    return this.hasTestFailures;
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
