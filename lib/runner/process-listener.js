const Logger = require('../util/logger.js');

module.exports = class {

  constructor(runner, finishCallback) {
    this.runner = runner;
    this.__exitCode = 0;
    this.finishCallback = finishCallback;

    process.on('exit', this.onExit.bind(this));
    process.on('uncaughtException', (err) => {
      Logger.warn('uncaughtException:');
      this.uncaught(err);
    });
    process.on('unhandledRejection', this.unhandled.bind(this));
  }

  setExitCode(code) {
    this.__exitCode = code;

    return this;
  }

  get exitCode() {
    return this.__exitCode;
  }

  testFailures() {
    return false;
  }

  onExit(code) {
    if (code > 0) {
      this.setExitCode(code);
    }

    if (this.exitCode === 0 && this.testFailures()) {
      this.setExitCode(1);
    }

    this.exit();
  }

  unhandled(err) {
    Logger.warn('unhandledRejection:');
    this.uncaught(err);
  }

  uncaught(err) {
    if (this.runner.currentSuite) {
      let runnable = this.runner.currentSuite.currentPromise;
      if (runnable) {
        runnable.reject(err);
        return;
      }
    }

    if (this.finishCallback) {
      this.finishCallback(err);
    } else {
      Logger.error(err);
    }

    this.setExitCode(1).exit();
  }

  exit() {
    process.exit(this.exitCode);

    return this;
  }
};