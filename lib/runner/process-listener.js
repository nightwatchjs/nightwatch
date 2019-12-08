const {Logger} = require('../utils');

module.exports = class {

  constructor(proc = process) {
    this.__exitCode = 0;
    this.testRunner = null;
    this.process = proc;
    this.finishCallback = null;

    this.exitListener = this.onExit.bind(this);
    this.exceptionListener = err => { this.uncaught(err); };
    this.rejectionListener = this.unhandled.bind(this);
    this.testCleanUpListener = this.clearExitListeners.bind(this);

    this.process.on('exit', this.exitListener)
      .on('uncaughtException', this.exceptionListener)
      .on('unhandledRejection', this.rejectionListener);

    this.process.on('cleanUpFromTests', this.testCleanUpListener);
  }

  /**
   * Clears all the exit listeners.
   * This allows us to clean up after tests & let mocha set the exitCode when exiting.
   */
  clearExitListeners() {
    this.process.removeListener('exit', this.exitListener);
    this.process.removeListener('uncaughtException', this.exceptionListener);
    this.process.removeListener('unhandledRejection', this.rejectionListener);
    this.process.removeListener('cleanUpFromTests', this.testCleanUpListener);
  }

  setTestRunner(testRunner) {
    this.testRunner = testRunner;

    return this;
  }

  setExitCode(code) {
    this.__exitCode = code;

    return this;
  }

  get exitCode() {
    return this.__exitCode;
  }

  onExit(code) {
    if (code > 0) {
      this.setExitCode(code);
    }

    this.exit();
  }

  unhandled(err) {
    Logger.warn('unhandledRejection:');
    console.error(err.stack)
    this.uncaught(err);
  }

  getCurrentPromise(err) {
    if (this.testRunner && this.testRunner.currentSuite) {
      this.testRunner.registerUncaughtErr(err);
      this.testRunner.currentSuite.emptyQueue();

      return new Promise((resolve) => {
        let runnable = this.testRunner.currentSuite.currentRunnable;

        if (runnable) {
          runnable.abort(err).then(_ => resolve());
        } else {
          resolve();
        }
      }).then(_ => {
        if (this.testRunner.publishReport) {
          this.testRunner.publishReport = false;

          return Promise.all([
            this.testRunner.closeOpenSessions(),
            this.testRunner.reportResults()
          ]).catch(err => {
            this.testRunner.registerUncaughtErr(err);

            return err;
          });
        }

        return Promise.resolve();
      });
    } else {
      Logger.error(err);
    }

    return Promise.resolve();
  }

  uncaught(err) {
    const WebDriver = require('./webdriver-server.js');

    this.getCurrentPromise(err)
      .then(_ => WebDriver.stopInstances())
      .then(_ => this.closeProcess(err));
  }

  closeProcess(err) {
    if (this.finishCallback) {
      this.finishCallback(err);
    }

    this.setExitCode(1).exit();
  }

  exit() {
    this.process.exit && this.process.exit(this.exitCode);

    return this;
  }
};
