const Logger = require('../util/logger.js');
const WebDriver = require('./webdriver-server.js');

module.exports = class {

  constructor(proc = process) {
    this.__exitCode = 0;
    this.testRunner = null;
    this.process = proc;
    this.finishCallback = null;

    this.process.on('exit', this.onExit.bind(this));
    this.process.on('uncaughtException', err => {
      this.uncaught(err);
    });

    this.process.on('unhandledRejection', this.unhandled.bind(this));
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
    this.uncaught(err);
  }

  getCurrentPromise(err) {
    if (this.testRunner && this.testRunner.currentSuite) {
      this.testRunner.registerUncaughtErr(err);
      let runnable = this.testRunner.currentSuite.currentPromise;
      if (runnable) {
        runnable.reject(err, true);
      }

      if (this.testRunner.result) {
        this.testRunner.publishReport = false;

        return Promise.all([
          this.testRunner.closeOpenSessions(),
          this.testRunner.reportResults()
        ]).catch(err => {
          this.testRunner.registerUncaughtErr(err);

          return err;
        });
      }
    } else {
      Logger.error(err);
    }

    return Promise.resolve();
  }

  uncaught(err) {
    this.getCurrentPromise(err)
      .then(_ => {
        return WebDriver.stopInstances();
      })
      .then(_ => {
        this.closeProcess(err);
      });
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