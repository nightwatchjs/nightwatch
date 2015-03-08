var util = require('util');
var events = require('events');
var Logger = require('./../util/logger.js');
var path = require('path');

module.exports = new (function() {
  var doneSymbol = String.fromCharCode(10004);
  var failSymbol = String.fromCharCode(10006);
  var initialized = false;
  var client;

  /**
   * Abstract assertion class that will subclass all defined assertions
   *
   * All assertions must implement the following api:
   *
   * - @type {boolean|function}
   *   expected
   * - @type {string}
   *   message
   * - @type {function}
   *   pass
   * - @type {function}
   *   value
   * - @type {function}
   *   command
   * - @type {function} - Optional
   *   failure
   *
   * @param {boolean} abortOnFailure
   * @param {Nightwatch} client
   * @constructor
   */
  function BaseAssertion(abortOnFailure, client) {
    events.EventEmitter.call(this);
    this.abortOnFailure = abortOnFailure;
    this.client = client;
    this.api = client.api;
  }

  util.inherits(BaseAssertion, events.EventEmitter);

  BaseAssertion.prototype.complete = function() {
    var self = this, args = Array.prototype.slice.call(arguments, 0);
    args.unshift('complete');

    setTimeout(function() {
      self.emit.apply(self, args);
    }, 0);
  };

  /**
   * Performs the command method
   * @returns {*}
   * @private
   */
  BaseAssertion.prototype._executeCommand = function() {
    var self = this;
    var methods = [
      'expected',
      'message',
      ['pass'],
      ['value'],
      ['command']
    ];
    methods.forEach(function(method) {
      if (Array.isArray(method)) {
        var name = method[0];
        if (typeof self[name] !== 'function') {
          throw new Error('Assertion must implement method ' + name);
        }
      } else if (typeof self[method] == 'undefined') {
        throw new Error('Assertion must implement method/property ' + method);
      }
    });

    return this.command(function(result) {
      var passed, value;

      if (typeof self.failure == 'function' && self.failure(result)) {
        passed = false;
        value = null;
      } else {
        value = self.value(result);
        passed = self.pass(value);
      }

      var expected = typeof self.expected == 'function' ? self.expected() : self.expected;
      self.client.assertion(passed, value, expected, self.message, self.abortOnFailure);
      self.emit('complete');
    });
  };

  /**
   * Assertion factory that creates the assertion instances with the supplied assertion definition
   *  and options
   *
   * @param {function} assertionFn
   * @param {boolean} abortOnFailure
   * @param {Nightwatch} client
   * @constructor
   */
  function AssertionInstance(assertionFn, abortOnFailure, client) {
    this.abortOnFailure = abortOnFailure;
    this.client = client;
    this.assertionFn = assertionFn;
  }

  /**
   * This will call the supplied constructor of the assertion, after calling the Base constructor
   *  first with other arguments and then inherits the rest of the methods from BaseAssertion
   *
   * @param {function} constructor
   * @param {Array} args
   * @returns {*}
   * @private
   */
  AssertionInstance.prototype._constructFromSuper = function(constructor, args) {
    var self = this;
    function F() {
      BaseAssertion.apply(this, [self.abortOnFailure, self.client]);
      return constructor.apply(this, args);
    }

    util.inherits(constructor, BaseAssertion);
    F.prototype = constructor.prototype;
    return new F();
  };

  AssertionInstance.prototype._commandFn = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var instance = this._constructFromSuper(this.assertionFn, args);

    return instance._executeCommand();
  };

  /**
   * @public
   * @param {function} assertionFn
   * @param {boolean} abortOnFailure
   * @param {Nightwatch} client
   * @returns {AssertionInstance}
   */
  this.factory = function(assertionFn, abortOnFailure, client) {
    return new AssertionInstance(assertionFn, abortOnFailure, client);
  };


  /**
   * Performs an assertion
   *
   * @param {Boolean} passed
   * @param {Object} receivedValue
   * @param {Object} expectedValue
   * @param {String} message
   * @param {Boolean} abortOnFailure
   */
  this.assert = function assert(passed, receivedValue, expectedValue, message, abortOnFailure) {
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
        var logged = Logger.colors.red(failSymbol) + '  ' + message;
        if (typeof expectedValue != 'undefined' && typeof receivedValue != 'undefined') {
          logged += ' ' + Logger.colors.white(' - expected ' + Logger.colors.green('"' +
            expectedValue + '"')) + ' but got: ' + Logger.colors.red(receivedValue);
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

    if (!passed) {
      if (client.options.screenshots.onFail) {
        var theBrowser = client.desiredCapabilities.browserName;
        var d = new Date();
        var dateStamp = d.toLocaleString('en-GB', {
          weekday: 'narrow',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZoneName: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          era: 'short'
        }).replace(/:/g, '').replace(/\s/g, '-').replace(/-\(.+?\)/, '');
        var testName = client.options.desiredCapabilities.name;
        var screenshotName = ('FAIL_' + testName + '_' + theBrowser + '_' + dateStamp).replace(/[^A-Za-z0-9_-]/g, '');
        var screenshotPath = path.resolve(path.join(client.options.screenshots.path, screenshotName + '.png'));
        client.api.saveScreenshot(screenshotPath, function(result) {
          if (abortOnFailure) {
            client.terminate();
          }
        });
        if (abortOnFailure) {
          client.api.pause(); // ensure test doesn't continue while we're taking a screenshot
        }
      } else {
        if (abortOnFailure) {
          client.terminate();
        }
      }
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

