const Logger = require('../util/logger.js');

module.exports = class {

  constructor(runner, finishCallback) {
    this.cliRunner = runner;
    this.finishCallback = finishCallback;

    process.on('exit', this.onExit.bind(this));
    process.on('uncaughtException', (err) => {
      Logger.warn('uncaughtException:');
      this.uncaught(err);
    });
    process.on('unhandledRejection', this.unhandled.bind(this));
  }

  testFailures() {
    return false;
  }

  onExit(code) {
    let exitCode = code;

    if (exitCode === 0 && this.testFailures()) {
      exitCode = 1;
    }

    process.exit(exitCode);
  }

  unhandled(err) {
    Logger.warn('unhandledRejection:');
    this.uncaught(err);
  }

  uncaught(err) {
    if (this.cliRunner.currentSuite) {
      let testCase = this.cliRunner.currentSuite.currentTest;
      if (testCase/* && testCase.running*/) {
        //testCase.catchHandler(err);
        //return;
      }
    }

    if (this.finishCallback) {
      this.finishCallback(err);
    } else {
      console.error(err);
    }

    process.exit(1);
  }
};