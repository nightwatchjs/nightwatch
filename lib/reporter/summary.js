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
    const title = ` – ${colors.stack_trace(testcaseName)} `;

    const details = (testcase.timeMs ? colors.yellow(`(${Utils.formatElapsedTime(testcase.timeMs)}${triesCount})`) : '') + triesContent;

    return `${title}${details}`;
  }

  static getFailedAssertions(testcase) {
    return testcase.assertions.reduce(function(prev, a) {
      if (a.failure !== false) {
        let message = a.stackTrace.split('\n');
        message.unshift(a.fullMsg);
        prev.push(message.join('\n'));
      }

      return prev;
    }, []).join('\n');
  }

  static getErrorContent(error) {
    let headline = colors.red(error.message);
    let stackTrace = Utils.stackTraceFilter(error.stack.split('\n'));

    return '   ' + headline + '\n' + colors.stack_trace(stackTrace);
  }

  /**
   * @param {object} testSuite
   * @param {string} testSuiteName
   * @param {boolean} startSessionEnabled
   * @return {[string]}
   */
  static getFailedSuiteContent({testSuite, testSuiteName, startSessionEnabled = true}) {
    const testcases = Object.keys(testSuite.completed);
    const initial = ['\n' + colors.red(` ${Utils.symbols.fail} ${testSuiteName}`)];

    if (testcases.length === 0 && (testSuite.lastError instanceof Error)) {
      initial.push(Summary.getErrorContent(testSuite.lastError));
    }

    return testcases.reduce((prev, name) => {
      const testcase = testSuite.completed[name];

      if (Summary.failed(testcase)) {
        prev.push(Summary.getTestcaseHeader(testcase, name));

        let content;
        if (Summary.shouldPrintAssertions(testcase) && startSessionEnabled) {
          content = Summary.getFailedAssertions(testcase);
        } else if (testcase.stackTrace) {
          //content = testcase.stackTrace;
        }

        if (content) {
          prev.push({content, stacktrace: true});
        }
      } else if (testcase.lastError) {
        prev.push(Summary.getErrorContent(testcase.lastError));
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
        console.log(line);
      }
    });
  }

  /**
   * @param {object} testSuite
   */
  static printErrors(testSuite) {
    if (Array.isArray(testSuite.errmessages)) {
      testSuite.errmessages.forEach(function(errorMessage) {
        console.log('');
        console.error(errorMessage);
        console.log('');
      });
    }
  }

  /**
   * @param {object} testSuite
   */
  static printSkipped(testSuite) {
    if (testSuite.skipped.length > 0) {
      console.log(colors.cyan('   SKIPPED:'));
      testSuite.skipped.forEach(function(testcase) {
        console.log(`   - ${testcase}`);
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

    testSuites.forEach(testSuiteName => {
      const testSuite = globalResults.modules[testSuiteName];

      if (Summary.failed(testSuite)) {
        Summary.printSuite(Summary.getFailedSuiteContent({
          testSuite,
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
