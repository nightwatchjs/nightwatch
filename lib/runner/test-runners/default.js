const {GlobalReporter} = require('../../reporter');
const TestSuite = require('../../testsuite');
const Concurrency = require('../concurrency');
const {Logger} = require('../../utils');

class DefaultRunner {
  get supportsConcurrency() {
    return true;
  }

  get type() {
    return 'nightwatch';
  }

  constructor(settings, argv, addtOpts) {
    this.startTime = new Date().getTime();
    this.settings = settings;
    this.argv = argv;
    this.addtOpts = addtOpts;
    this.publishReport = true; // in-case of an uncaught exception, the report will not be published
    this.globalReporter = new GlobalReporter(argv.reporter, settings, {
      openReport: argv.open,
      reportFileName: argv['report-filename']
    });
  }

  get client() {
    return this.currentSuite && this.currentSuite.client;
  }

  get results() {
    return this.globalReporter.globalResults;
  }

  hasTestFailures() {
    return this.globalReporter.hasTestFailures();
  }

  registerUncaughtErr(err) {
    this.globalReporter.registerUncaughtErr(err);
  }

  /**
   * @param {Error} [err]
   * @return {Promise}
   */
  closeOpenSessions(err) {
    if (this.client && this.client.sessionId && this.client.startSessionEnabled) {
      Logger.info(`Attempting to close session ${this.client.sessionId}...`);

      const failures = !this.currentSuite.reporter.allTestsPassed;

      return this.currentSuite.terminate(failures ? 'FAILED' : '', null, true);
    }

    return Promise.resolve();
  }

  async createTestSuite({modulePath, modules}) {
    const {settings, argv, addtOpts} = this;

    const testSuite = new TestSuite({modulePath, modules, settings, argv, addtOpts});
    await testSuite.init();

    return testSuite;
  }

  async runTestSuite(modulePath, modules) {
    try {
      this.currentSuite = await this.createTestSuite({modulePath, modules});
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

    if (!this.argv['launch-url']) {
      this.globalReporter.addTestSuiteResults(this.currentSuite.reporter.exportResults());
    }

    if (possibleErr instanceof Error) {
      throw possibleErr;
    }
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
   * @param {Array} modules
   * @return {Promise}
   */
  runTests(modules) {
    this.modulePathsCopy = modules.slice(0);
    this.fullPaths = modules;

    return new Promise(this.promiseFn.bind(this));
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
   *
   * @param {Array} testEnvArray
   * @param {Array} modules
   * @return {Promise<number>}
   */
  async runConcurrent(testEnvArray, modules, isTestWorkerEnabled, isSafariEnvPresent) {
    this.concurrency = new Concurrency(this.settings, this.argv, isTestWorkerEnabled, isSafariEnvPresent);
    this.globalReporter.setupChildProcessListener(this.concurrency);

    const exitCode = await this.concurrency.runMultiple(testEnvArray, modules);
    await this.reportResults();

    return exitCode;
  }

  isTestWorker() {
    return Concurrency.isTestWorker(this.argv);
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  async run(modules) {
    let possibleErr;
    let result;

    try {
      result = await this.runTests(modules);
    } catch (err) {
      if (this.modulePathsCopy && this.modulePathsCopy.length > 0) {
        this.globalReporter.skippedSuites = this.modulePathsCopy.length;
      }
      possibleErr = err;
    }

    await this.closeOpenSessions();

    if (this.publishReport) {
      await this.reportResults();
    }

    if (possibleErr) {
      throw possibleErr;
    }

    return this.hasTestFailures(result);
  }
}

module.exports = DefaultRunner;
