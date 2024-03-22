const Utils = require('../utils');
const {Logger} = Utils;
const {colors} = Logger;

module.exports = class Summary {
  static failed(test) {
    return test.failures > 0 || test.failed > 0 || test.errors > 0;
  }

  static getTestcaseHeader(testcase, testcaseName) {
    const triesCount = testcase.retries > 0 ? ` x ${testcase.retries + 1}` : '';
    const triesContent = testcase.retries > 0 ? ` - ${triesCount} tries` : '';
    const title = `\n   ${colors.light_cyan('–')} ${colors.light_cyan(testcaseName)} `;

    const details = (testcase.timeMs ? colors.stack_trace(`(${Utils.formatElapsedTime(testcase.timeMs)}${triesCount})`) : '') + triesContent;

    return `${title}${details}\n`;
  }

  /**
   * @param {object} testSuite
   * @param {string} testSuiteName
   * @param {number} index
   * @param {boolean} startSessionEnabled
   * @return {[string]}
   */
  static getFailedSuiteContent({testSuite, testSuiteName, index = 0, startSessionEnabled = true}) {
    const testcases = Object.keys(testSuite.completed);
    const initial = [colors.red(`   ${Utils.symbols.fail} ${index + 1}) ${testSuiteName}`)];

    return testcases.reduce((prev, name) => {
      const testcase = testSuite.completed[name];

      if (Summary.failed(testcase)) {
        prev.push(Summary.getTestcaseHeader(testcase, name));

        let content;
        if (Summary.shouldPrintAssertions(testcase) && startSessionEnabled) {
          content = Logger.getFailedAssertions(testcase.assertions, testSuite.modulePath);
        } else if (testcase.lastError) {
          content = '  ' + Logger.getErrorContent(testcase.lastError, testSuite.modulePath);
        }

        if (content) {
          prev.push(content);
          testSuite.globalErrorRegister.push(content);
        }
      } else if (testcase.lastError) {
        prev.push(Logger.getErrorContent(testcase.lastError, testSuite.modulePath));
      }

      return prev;
    }, initial);
  }

  /**
   * @param {Array} content
   */
  static printSuite(content) {
    content.forEach(line => {
      if (Utils.isObject(line) && line.stacktrace) {
        Utils.showStackTrace(line.content);
      } else {
        // eslint-disable-next-line no-console
        console.log(line);
      }
    });
  }

  /**
   * @param {object} testSuite
   */
  static printErrors(testSuite) {
    if (Array.isArray(testSuite.errmessages)) {
      testSuite.errmessages = testSuite.errmessages.reduce((prev, val) => {
        if (testSuite.globalErrorRegister && !testSuite.globalErrorRegister.includes(val)) {
          testSuite.globalErrorRegister.push(val);
          prev.push(val);
        }

        return prev;
      }, []);

      if (testSuite.errmessages.length > 0) {
        // eslint-disable-next-line no-console
        console.log(colors.stack_trace('\n  - OTHER ERRORS:'));
      }

      testSuite.errmessages.forEach(function(errorMessage, index) {
        // eslint-disable-next-line no-console
        Logger.error(errorMessage);
      });
    }
  }

  /**
   * @param {object} testSuite
   */
  static printSkipped(testSuite) {
    if (testSuite.skippedAtRuntime.length > 0) {
      // eslint-disable-next-line no-console
      console.log(colors.cyan('    SKIPPED (at runtime):'));
      testSuite.skippedAtRuntime.forEach(function(testcase) {
        // eslint-disable-next-line no-console
        console.log(`    - ${testcase}`);
      });
    }

    if (testSuite.skippedByUser.length > 0) {
      // eslint-disable-next-line no-console
      console.log(colors.cyan('    SKIPPED (by user):'));
      testSuite.skippedByUser.forEach(function(testcase) {
        // eslint-disable-next-line no-console
        console.log(`    - ${testcase}`);
      });
    }
  }

  constructor(settings) {
    this.settings = settings;
  }

  static shouldPrintAssertions(testcase) {
    return testcase.assertions.length > 0;
  }

  print(globalResults) {
    const testSuites = Object.keys(globalResults.modules);
    const testSuitesCount = testSuites.length;

    let failedIndex = 0;
    testSuites.forEach((testSuiteName, index) => {
      const testSuite = globalResults.modules[testSuiteName];

      if (Summary.failed(testSuite)) {
        testSuite.globalErrorRegister = [];

        Summary.printSuite(Summary.getFailedSuiteContent({
          testSuite,
          index: failedIndex++,
          testSuiteName,
          startSessionEnabled: this.settings.start_session
        }));

        Summary.printErrors(testSuite);
        Summary.printSkipped(testSuite);
      }
    });

    if (testSuites.length === 0) {
      Summary.printErrors(globalResults);
    }
  }
};
