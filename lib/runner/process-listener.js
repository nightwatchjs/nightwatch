const {Logger} = require('../utils');

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
    Logger.warn(`unhandledRejection: ${err.message}`);
    this.uncaught(err);
  }

  async getCurrentPromise(err) {
    if (this.testRunner) {
      const {currentSuite} = this.testRunner;
      if (!currentSuite) {
        return;
      }

      if (currentSuite.uncaughtError) {
        Logger.error('An additional uncaught error occurred while trying to handle the previous one – ' + err.stack);

        return;
      }

      this.testRunner.registerUncaughtErr(err);
      currentSuite.emptyQueue();
      currentSuite.setUncaughtError(err);

      const {currentRunnable} = currentSuite;
      if (currentRunnable) {
        await currentRunnable.abort(err);
      }

      await this.testRunner.closeOpenSessions(err);

      if (this.testRunner.publishReport) {
        this.testRunner.publishReport = false;
        await this.testRunner.reportResults();
      }
    } else {
      Logger.error(err);
    }
  }

  uncaught(err) {
    const WebDriver = require('./webdriver-server.js');

    err.uncaught = true;

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
