var util = require('util');
var events = require('events');
var Logger = require('./../util/logger.js');

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
    this.startTime = new Date().getTime();
    this.globals = this.api.globals || {};
    this.timeout = this.globals.retryAssertionTimeout || 0; //ms
    this.rescheduleInterval = this.globals.waitForConditionPollInterval || 500; //ms
    this.shouldRetry = this.timeout > 0;
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

    return this._scheduleAssertion();
  };

  BaseAssertion.prototype._scheduleAssertion = function() {
    var self = this;
    return this.command(function(result) {
      var passed, value;

      if (typeof self.failure == 'function' && self.failure(result)) {
        passed = false;
        value = null;
      } else {
        value = self.value(result);
        passed = self.pass(value);
      }

      var timeSpent = new Date().getTime() - self.startTime;
      if (!passed && timeSpent < self.timeout) {
        return self._reschedule();
      }

      var expected = typeof self.expected == 'function' ? self.expected() : self.expected;
      var message = self._getFullMessage(passed, timeSpent);

      self.client.assertion(passed, value, expected, message, self.abortOnFailure, self._stackTrace);
      self.emit('complete');
    });
  };

  BaseAssertion.prototype._getFullMessage = function(passed, timeSpent) {
    if ( !this.shouldRetry) {
      return this.message;
    }
    var timeLogged = passed ? timeSpent : this.timeout;
    return this.message + ' after ' + timeLogged + ' milliseconds.';
  };

  BaseAssertion.prototype._reschedule = function() {
    setTimeout(function(){}, this.rescheduleInterval);
    return this._scheduleAssertion();
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

  AssertionInstance.prototype._commandFn = function commandFn() {
    var args = Array.prototype.slice.call(arguments, 0);
    var instance = this._constructFromSuper(this.assertionFn, args);
    instance._stackTrace = commandFn.stackTrace;
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
   * @param {String} originalStackTrace
   */
  this.assert = function assert(passed, receivedValue, expectedValue, message, abortOnFailure, originalStackTrace) {
    if (!initialized) {
      throw new Error('init must be called first.');
    }

    var failure = '';
    var stacktrace = '';

    if (passed) {
      if (client.options.output) {
        console.log(' ' + Logger.colors.green(doneSymbol) + ' ' + message);
      }
      client.results.passed++;
    } else {
      failure = 'Expected "' + expectedValue + '" but got: "' + receivedValue + '"';

      try {
        var err = new Error();
        err.name = message;
        err.message = failure;

        if (originalStackTrace) {
          var stackParts = originalStackTrace.split('\n');
          stackParts.shift();
          if (!client.options.start_session) {
            stackParts.unshift('AssertionError: ' + message);
          }
          originalStackTrace = getUsefulStacktrace(stackParts);
          err.stack = originalStackTrace;
        } else {
          Error.captureStackTrace(err, arguments.callee);
        }

        throw err;
      } catch (ex) {
        var logged = ' ' + Logger.colors.red(failSymbol) + ' ' + message;
        if (typeof expectedValue != 'undefined' && typeof receivedValue != 'undefined') {
          logged += ' ' + Logger.colors.white(' - expected ' + Logger.colors.green('"' +
            expectedValue + '"')) + ' but got: ' + Logger.colors.red(receivedValue);
        }

        if (client.options.output) {
          console.log(logged);
        }
        stacktrace = ex.stack;
        client.results.lastError = ex;

        if (client.options.output) {
          if (client.options.start_session) {
            console.log(Logger.colors.light_gray(stacktrace));
          } else {
            var parts = stacktrace.split('\n');
            parts.shift();
            console.log(Logger.colors.light_gray(parts.join('\n')));
          }
        }
      }
      client.results.failed++;
    }

    client.results.tests.push({
      message : message,
      stacktrace : stacktrace,
      failure : failure !== '' ? failure : false
    });

    if (!passed && abortOnFailure && client.options.start_session) {
      client.terminate();
    }
  };

  function getUsefulStacktrace(parts) {
    var stack = [];
    var regex = /^\s*at Nightwatch\..+/;

    for (var i = 0; i < parts.length; i++) {
      if (regex.test(parts[i])) {
        break;
      }
      stack.push(parts[i]);
    }
    return stack.join('\n');
  }

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
