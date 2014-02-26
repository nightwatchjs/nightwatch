var Logger = require('./logger.js');

module.exports = new (function() {
  var doneSymbol = String.fromCharCode(10004);
  var failSymbol = String.fromCharCode(10006);
  var initialized = false;
  var client;

  /**
   * Performs an assertion
   *
   * @param {Boolean} passed
   * @param {Object} receivedValue
   * @param {Object} expectedValue
   * @param {String} message
   * @param {Boolean} abortOnFailure
   */
  this.assert = function assert(passed, receivedValue, expectedValue, message, abortOnFailure, stripExpected) {
    if (!initialized) {
      throw new Error('init must be called first.');
    }

    var failure = '';
    var stacktrace = '';

    if (passed) {
      if (client.options.output) {
        console.log(Logger.colors.green(doneSymbol) + '  ' + message);
      }
      client.results.passed++;
    } else {
      failure = 'Expected "' + expectedValue + '" but got: "' + receivedValue + '"';
      try {
        var err = new Error();
        err.name = 'Assertion failed in: ' + message;
        err.message = failure;
        Error.captureStackTrace(err, arguments.callee);
        throw err;
      } catch (ex) {
        stripExpected = stripExpected || false;
        var logged = Logger.colors.red('✖') + '  ' + message;
        if (typeof expectedValue != 'undefined' && typeof receivedValue != 'undefined') {
          logged += stripExpected ? (' ' + Logger.colors.white(' - expected ' + Logger.colors.green('"' +
            expectedValue + '"')) + ' but got: ' + Logger.colors.red(receivedValue)) : '';
        }

        if (client.options.output) {
          console.log(logged);
        }
        stacktrace = ex.stack;
      }
      client.results.failed++;
    }

    client.results.tests.push({
      message : message,
      stacktrace : stacktrace,
      failure : failure !== '' ? failure : false
    });

    if (!passed && abortOnFailure) {
      client.terminate();
    }
  };

  /**
   * Initializer
   *
   * @param {Object} c Nightwatch client instance
   */
  this.init = function(c) {
    client = c;
    initialized = true;
  };
})();

