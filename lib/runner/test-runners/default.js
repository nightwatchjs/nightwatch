const GlobalReporter = require('../global-reporter.js');
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

  get results() {
    return this.globalReporter.globalResults;
  }

  registerUncaughtErr(err) {
    if (err instanceof TypeError && /\w is not a function$/.test(err.message)) {
      err.message = err.message + '; it seems like your are trying to run a unit test without specifying "unit_tests_mode=true" in config settings.';
    }
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
      const Runner = require('../runner.js');
      throw Runner.createError(err);
    }

    return this.currentSuite.run()
      .catch(err => {
        return err;
      })
      .then(possibleErr => {
        this.globalReporter.addTestSuiteResults(this.currentSuite.reporter.exportResults());

        if (possibleErr instanceof Error) {
          throw possibleErr;
        }
      });
  }

  isTestWorker() {
    return Concurrency.isChildProcess() && this.argvOpts['test-worker'];
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  run(modules) {
    this.result = this.runMultipleTests(modules)
      .catch(err => {
        this.globalReporter.registerUncaughtErr(err);

        return err;
      })
      .then(possibleErr => {
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
    if (this.isTestWorker()) {
      return this.globalReporter.hasTestFailures();
    }

    this.printGlobalResults();

    return this.globalReporter.save()
      .then(_ => {
        return this.globalReporter.hasTestFailures();
      });
  }

  runConcurrent(testEnvArray, modules) {
    this.concurrency = new Concurrency(this.settings, this.argvOpts);
    this.globalReporter.setupChildProcessListener(this.concurrency);

    return this.concurrency
      .runMultiple(testEnvArray, modules)
      .then(exitCode => {
        return this.reportResults().then(hasFailures => {
          return exitCode;
        });
      });
  }
}

module.exports = DefaultRunner;
