var util = require('util');
var events = require('events');
var Logger = require('./../util/logger.js');
var Utils = require('./../util/utils.js');

module.exports = new (function() {
  var doneSymbol = Utils.symbols.ok;
  var failSymbol = Utils.symbols.fail;
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

    setImmediate(function() {
      self.emit.apply(self, args);
    });
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
   *
   * @param {string} stackTrace
   * @param {string|null} message
   */
  function buildStackTrace(stackTrace, message) {
    var stackParts = stackTrace.split('\n');
    stackParts.shift();

    if (message) {
      stackParts.unshift(message);
    }

    return Utils.stackTraceFilter(stackParts);
  }

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
    var fullMsg = '';

    if (passed) {
      if (client.options.output && client.options.detailed_output) {
        console.log(' ' + Logger.colors.green(doneSymbol) + ' ' + message);
      }
      client.results.passed++;
    } else {
      failure = 'Expected "' + expectedValue + '" but got: "' + receivedValue + '"';
      var err = new Error();

      err.name = message;
      err.message = message + ' - ' + failure;

      if (!originalStackTrace) {
        Error.captureStackTrace(err, arguments.callee);
        originalStackTrace = err.stack;
      }

      err.stack = buildStackTrace(originalStackTrace, client.options.start_session ? null : 'AssertionError: ' + message);

      fullMsg = message;
      if (client.options.output && client.options.detailed_output) {
        var logged = ' ' + Logger.colors.red(failSymbol);
        if (typeof expectedValue != 'undefined' && typeof receivedValue != 'undefined') {
          fullMsg += ' ' + Logger.colors.white(' - expected ' + Logger.colors.green('"' +
                expectedValue + '"')) + ' but got: ' + Logger.colors.red('"' + receivedValue + '"');
        }
        logged += ' ' + fullMsg;
        console.log(logged);
      }

      stacktrace = err.stack;
      if (client.options.output && client.options.detailed_output) {
        var parts = stacktrace.split('\n');
        console.log(Logger.colors.stack_trace(parts.join('\n')) + '\n');
      }

      client.results.lastError = err;
      client.results.failed++;
    }

    client.results.tests.push({
      message : message,
      stackTrace : stacktrace,
      fullMsg : fullMsg,
      failure : failure !== '' ? failure : false
    });

    if (!passed && abortOnFailure) {
      client.terminate(true);
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
