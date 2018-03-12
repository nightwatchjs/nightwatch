const GlobalReporter = require('../global-reporter.js');
const TestSuite = require('../../testsuite/testsuite.js');
const Logger = require('../../util/logger.js');
const Runner = require('../runner.js');

class DefaultRunner {
  get supportsConcurrency() {
    return true;
  }

  constructor(source, settings, argv, addtOpts) {
    this.startTime = new Date().getTime();
    this.settings = settings;
    this.argvOpts = argv;
    this.addtOpts = addtOpts;
    this.publishReport = true;
    this.globalReporter = new GlobalReporter(argv.reporter, settings);
  }

  get client() {
    return this.currentSuite && this.currentSuite.client;
  }

  get promise() {
    return this.__promise;
  }

  registerUncaughtErr(err) {
    Logger.error(err);

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

  /**
   * @param {Array} modules
   * @return {Promise}
   */
  runMultipleTests(modules) {
    this.modulePathsCopy = modules.slice(0);
    this.fullPaths = modules;

    this.createPromise();

    return this.promise;
  }

  runTestSuite(modulePath, modules) {
    try {
      this.currentSuite = new TestSuite(modulePath, modules, this.settings, this.argvOpts, this.addtOpts);
      this.currentSuite.init();
    } catch (err) {
      throw Runner.createError(err);
    }

    return this.currentSuite.run()
      .then(_ => {
        this.globalReporter.addTestSuiteResults(this.currentSuite.reporter.exportResults());
      });
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  run(modules) {
    this.result = this.runMultipleTests(modules)
      .then(_ => {
        return this.closeOpenSessions();
      })
      .then(_ => {
        if (!this.publishReport) {
          return;
        }

        return this.reportResults();
      });

    return this.result;
  }

  printGlobalResults() {
    this.globalReporter.create(this.startTime).print();

    return this;
  }

  /**
   * @return {Promise}
   */
  reportResults() {
    this.printGlobalResults();

    return this.globalReporter.save()
      .then(_ => {
        return this.globalReporter.hasTestFailures();
      });
  }

  runConcurrent(testEnvArray, modules) {
    const Concurrency = require('../concurrency/concurrency.js');

    this.concurrency = new Concurrency(this.settings, this.argvOpts);
    this.globalReporter.setupChildProcessListener(this.concurrency);

    return this.concurrency.runMultiple(testEnvArray, modules);
  }
}

module.exports = DefaultRunner;