const TestSuite = require('../testsuite/testsuite.js');
const Walker = require('./folder-walk.js');
const ProcessListener = require('./process-listener.js');
const GlobalReporter = require('./global-reporter.js');
const Logger = require('../util/logger.js');
const Utils = require('../util/utils.js');

class Runner {
  constructor(testSource, settings, addtOpts) {
    this.processListener = new ProcessListener(this);

    this.startTime = new Date().getTime();
    this.settings = settings;
    this.addtOpts = addtOpts;
    this.walker = new Walker(testSource, settings);
    this.globalReporter = new GlobalReporter(addtOpts.reporter, settings);
  }

  get client() {
    return this.currentSuite && this.currentSuite.client;
  }

  get promise() {
    return this.__promise;
  }

  static createError(err) {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          return new Error('Cannot read source folder: ' + err.path);
      }

      return err;
    }

    return false;
  }

  checkTestSource(modules) {
    if (modules && modules.length === 0) {
      let errorMessage = ['No tests defined! using source folder:', this.walker.fullPaths];
      if (this.settings.tag_filter) {
        errorMessage.push('; using tags:', this.settings.tag_filter);
      }

      return new Error(errorMessage.join(' '));
    }

    return true;
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

  runMultipleTests(modules) {
    this.modulePathsCopy = modules.slice(0);
    this.fullPaths = modules;

    this.createPromise();

    return this.promise;
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

  runTestSuite(modulePath, modules) {
    try {
      this.currentSuite = new TestSuite(modulePath, modules, this.settings, {});
    } catch (err) {
      throw Runner.createError(err);
    }

    this.globalReporter.addTestSuiteResults(this.currentSuite.reporter.testResults);

    return this.currentSuite.run();
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  run() {
    return this.walker.readTestSource()
      .catch(err => {
        throw Runner.createError(err);
      })
      .then(modules => {
        let error = this.checkTestSource(modules);
        if (error instanceof Error) {
          throw error;
        }

        return this.runMultipleTests(modules);
      })
      .then(_ => {
        if (this.globalReporter.hasTestFailures()) {
          this.processListener.setExitCode(5);
        }

        this.globalReporter.create(this.startTime).print();

        return this.globalReporter.save();
      })
      .catch(err => {
        if (err instanceof Error) {
          Utils.showStackTrace(err.stack);
        } else {
          console.error('An error occurred while running the tests: ', Logger.colors.red(err.message));
        }

        if (err.data) {
          Logger.warn(' ' + err.data);
        }

        this.processListener.setExitCode(5);
      })
      .then(_ => {
        return this.closeOpenSessions();
      });
  }
}

module.exports = Runner;