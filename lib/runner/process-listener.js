const {Logger} = require('../utils');
const analyticsCollector = require('../utils/analytics.js');

module.exports = class {

  constructor(proc = process) {
    this.__exitCode = 0;
    this.testRunner = null;
    this.process = proc;
    this.finishCallback = null;

    this.addExitListener();
    this.process.once('uncaughtException', err => {
      this.uncaught(err);
    });

    this.process.on('unhandledRejection', this.unhandled.bind(this));
  }

  addExitListener() {
    // when used programmatically, nightwatch will keep adding exit listeners for each test suite
    const listeners = this.process.listeners('exit');
    const isAlreadyAdded = listeners.find(item => {
      return item.name.includes('exitHandlerNightwatch');
    });

    if (!isAlreadyAdded) {
      this.exitHandler = function exitHandlerNightwatch(code) {
        return this.onExit(code);
      }.bind(this);
      this.process.on('exit', this.exitHandler);
    }
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
    this.process.exitCode = code || this.exitCode;
  }

  unhandled(err) {
    this.uncaught(err, {type: 'unhandledRejection'});
  }

  getCurrentPromise(err) {
    if (this.testRunner) {
      const {currentSuite} = this.testRunner;

      if (currentSuite && (currentSuite.uncaughtError instanceof Error)) {
        Logger.error('An additional uncaught error occurred while trying to handle the previous one – ' + err.stack);

        return;
      }

      this.testRunner.registerUncaughtErr(err);
      if (currentSuite) {
        currentSuite.emptyQueue();
        currentSuite.setUncaughtError(err);
      }

      if (this.testRunner.publishReport) {
        this.testRunner.publishReport = false;
        this.testRunner.reportResults().then(() => {}).catch(err => console.error(err));
      }
    }
  }

  uncaught(err, {type = 'uncaughtException'} = {}) {
    Logger.setOutputEnabled(true); // force log for uncaught exception
    Logger.enable();

    Logger.error(`${type}: ${err.message}\n${err.stack}`);
    analyticsCollector.exception(err);

    if (['TimeoutError', 'NoSuchElementError'].includes(err.name) && this.testRunner.type !== 'cucumber') {
      this.closeProcess(err);
      if (this.testRunner && this.testRunner.publishReport) {
        this.testRunner.publishReport = false;
        this.testRunner.reportResults().catch(() => {}).then(function() {});
      }

      return;
    }

    this.getCurrentPromise(err);

    return this.closeProcess(err);
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
