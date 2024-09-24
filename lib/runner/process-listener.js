const {Logger, SafeJSON} = require('../utils');
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

  async getCurrentPromise(err) {
    if (this.testRunner) {
      const {currentSuite} = this.testRunner;

      if (currentSuite && (currentSuite.uncaughtError instanceof Error)) {
        Logger.error('An additional uncaught error occurred while trying to handle the previous one – ' + err.stack);

        return;
      }

      this.testRunner.registerUncaughtErr(err);

      // let testSuiteReportResults;
      if (currentSuite) {
        // if (currentSuite.commandQueue) {
        //   // empty the queue but keep it in progress, unlike `currentSuite.emptyQueue()` which resets the queue completely.
        //   // (we'll add `end` command to the queue later so it should continue fine)
        //   const tree = currentSuite.commandQueue.tree;
        //   tree.currentNode = tree.rootNode;
        //   tree.empty();
        // }
        currentSuite.emptyQueue();
        currentSuite.setUncaughtError(err);
        // To reject the deferred promise directly inside runnable.js > run(), but this had problems:
        // * if the promise is already resolved before, this won't do anything.
        // currentSuite.currentRunnable?.deferred?.rejectFn(err);

        // make sure the report is up-to-date for events till now.
        const reporter = currentSuite.reporter;
        reporter.registerTestError(err);

        // below lines should be kept for old way (without setting env and closing the process)
        // currentSuite.testCaseFinished();
        // testSuiteReportResults = reporter.exportResults();

        // await currentSuite.client.api.end(true, () => {
        //   // empty queue for any command added while the `.end()`
        //   // command was executing (async event loop).
        //   currentSuite.emptyQueue();
        // });

        // const endCommandPromise = currentSuite.client.api.end(true, () => {
        //   // empty queue for any command added while the `.end()`
        //   // command was executing (async event loop).
        //   process.env.NW_UNCAUGHT_ERROR = '1';
        // });

        const quitCommandPromise = currentSuite.client.api.quit();
        process.env.NW_UNCAUGHT_ERROR = '1';

        await quitCommandPromise;
      }


      // await this.testRunner.closeOpenSessions(); // could've used in place of `.end()` call above but no mechanism to clear queue again with this.

      if (this.testRunner.publishReport) {
        // since we are now continuing the execution, we should not publish the report here.
        // so, commenting out the below lines.

        // this.testRunner.publishReport = false;

        // // see how uncaught error can be added to the report.
        // // console.log(testSuiteReporter.exportResults());
        // // this.testRunner.globalReporter.addTestSuiteResults(testSuiteReportResults);

        // this.testRunner.printGlobalResults();


        // The code below is for passing the report to the main thread in case of uncaught errors in parallel processes.

        // return this.testRunner.reportResults().catch(err => console.error(err)).then(() => {
        //   if (this.testRunner.isTestWorker() && process.port && typeof process.port.postMessage === 'function') {
        //     // const reporter = testSuiteReporter;
        //     // reporter.registerFailed(err);

        //     process.port.postMessage(SafeJSON.stringify({
        //       type: 'testsuite_finished',
        //       results: testSuiteReportResults, // could be undefined??
        //       httpOutput: Logger.collectOutput()
        //     }));
        //   }
        // });
      }
    }
  }

  uncaught(err, {type = 'uncaughtException'} = {}) {
    const isVerboseLogEnabled = Logger.isEnabled();
    Logger.setOutputEnabled(true); // force log for uncaught exception
    Logger.enable();

    Logger.error(`${type}: ${err.message}\n${err.stack}`);
    analyticsCollector.collectErrorEvent(err, true);

    if (!isVerboseLogEnabled) {
      Logger.disable();
    }

    if (['TimeoutError', 'NoSuchElementError'].includes(err.name) && this.testRunner.type !== 'cucumber') {
      this.closeProcess(err);
      if (this.testRunner && this.testRunner.publishReport) {
        this.testRunner.publishReport = false;
        this.testRunner.reportResults().catch(() => {}).then(function() {});
      }

      return;
    }

    return this.getCurrentPromise(err).then(() => {
      // return this.closeProcess(err);
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
