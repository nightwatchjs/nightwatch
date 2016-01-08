/**
 * Abstract assertion class that will subclass all defined Chai assertions
 *
 * All assertions must implement the following api:
 *
 * - @type {function}
 *   executeCommand
 * - @type {string}
 *   elementFound
 * - @type {function}
 *   elementNotFound
 * - @type {function}
 *   retryCommand
 * - @type {string}
 *   expected
 * - @type {string}
 *   actual
 * - @type {string}
 *   message
 * - @type {boolean}
 *   passed
 *
 * @constructor
 */
var util = require('util');
var events = require('events');
var Assertion = require('../../core/assertion.js');
var chai = require('chai-nightwatch');
var flag = chai.flag;
var Utils = require('../../util/utils.js');

function BaseAssertion() {
}

BaseAssertion.ASSERT_FLAGS = [
  'be',
  'that',
  'have',
  'which',
  'equal',
  'contains',
  'matches',
  'before',
  'after',
  'waitFor'
];

/**
 * @override
 */
BaseAssertion.prototype.executeCommand = function(callback) {};

BaseAssertion.prototype.setAssertion = function(assertion) {
  this.assertion = assertion;
  return this;
};

BaseAssertion.prototype.flag = function(key, value) {
  if (typeof value == 'undefined') {
    return flag(this.assertion, key);
  }

  flag(this.assertion, key, value);
  return this;
};

BaseAssertion.prototype.setClient = function(client) {
  this.client = client;
  return this;
};

BaseAssertion.prototype.setProtocol = function(protocol) {
  this.protocol = protocol;
  return this;
};

BaseAssertion.prototype.init = function() {
  this.promise  = this.flag('promise');
  this.element  = this.flag('element');
  this.selector = this.flag('selector');

  this.setNegate();

  this.waitForMs      = this.client.api.globals.waitForConditionTimeout || null;
  if (this.waitForMs) {
    this.flag('waitFor', this.waitForMs);
  }
  this.retryInterval  = this.client.api.globals.waitForConditionPollInterval || 500;
  this.retries        = 0;
  this.messageParts   = [];
  this.abortOnFailure = typeof this.client.api.globals.abortOnAssertionFailure == 'undefined' || this.client.api.globals.abortOnAssertionFailure;
  this.passed         = false;
  this.expected       = null;
  this.elementResult  = null;
  this.flags          = [];
};

BaseAssertion.prototype.start = function() {
  this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
};

BaseAssertion.prototype.onPromiseResolved = function(elementResult) {
  if (elementResult) {
    this.elementResult = elementResult;
  }

  this.executeCommand(function(result) {
    this.resultValue = result.value;
    this.resultStatus = result.status;
    this.resultErrorStatus = result.errorStatus;

    this.processFlags();
    this.elementFound();

    if (!this.passed && this.shouldRetry()) {
      this.scheduleRetry();
    } else {
      this.done();
    }
  }.bind(this));
};

BaseAssertion.prototype.onPromiseRejected = function(response) {
  this.processFlags();

  if (this.shouldRetry() && !this.negate) {
    this.scheduleRetry();
    return;
  }

  this.messageParts.push(' - element was not found');
  this.actual = 'not present';
  this.expected = 'present';

  this.elementNotFound();
  this.done();
};

BaseAssertion.prototype.processFlags = function() {
  BaseAssertion.ASSERT_FLAGS.forEach(function(entry) {
    var value = this.flag(entry);
    if ((typeof value != 'undefined') && (typeof this['@' + entry + 'Flag'] == 'function')) {
      this.flags.push([entry, value]);
      this['@' + entry + 'Flag'](value);
    }
  }.bind(this));
};

BaseAssertion.prototype.hasFlag = function(type) {
  return this.flags.some(function(flag) {
    return flag[0] === type;
  });
};

/**
 * @override
 */
BaseAssertion.prototype.elementFound = function() {};

/**
 * @override
 */
BaseAssertion.prototype.elementNotFound = function() {};

BaseAssertion.prototype.done = function() {
  this.formatMessage();
  var stackTrace = this.flag('element')._stackTrace;

  Assertion.assert(
    this.passed,
    this.actual,
    this.expected,
    this.message,
    this.abortOnFailure,
    stackTrace
  );

  this.element.emitter.emit('complete');
};

BaseAssertion.prototype.getResult = function(value, fn) {
  var result = fn.call(this);
  this.setNegate();
  return this.negate ? !result : result;
};

BaseAssertion.prototype.shouldRetryLocateElement = function() {
  return (!this.elementResult || this.resultStatus === 10 || this.resultErrorStatus === 10);
};

BaseAssertion.prototype.shouldRetry = function() {
  if (!this.waitForMs) {
    return false;
  }

  this.elapsedTime = this.getElapsedTime();
  return (this.elapsedTime < this.waitForMs);
};

BaseAssertion.prototype.getElapsedTime = function() {
  var timeNow = new Date().getTime();
  return timeNow - this.element.startTime;
};

BaseAssertion.prototype.scheduleRetry = function() {
  this.retries++;
  setTimeout(this.retryCommand.bind(this), this.retryInterval);
};

BaseAssertion.prototype.formatMessage = function() {
  this.message = Utils.format(this.message || this.message, this.selector);
  this.message += this.messageParts.join('');
};

BaseAssertion.prototype['@containsFlag'] = function(value) {
  var verb = (this.hasFlag('that') || this.hasFlag('which')) ? 'contains' : 'contain';
  this.conditionFlag(value, function() {
    return this.resultValue ? this.resultValue.indexOf(value) > -1 : false;
  }, [
    'not ' + verb,
    verb
  ]);

  return this;
};

BaseAssertion.prototype['@equalFlag'] = function(value) {
  var verb;
  if (this.hasFlag('have')) {
    verb = (this.hasFlag('that') || this.hasFlag('which')) ? 'equals' : 'equal to';
  } else {
    verb = 'equal';
  }
  this.conditionFlag(value, function() {
    return this.resultValue == value;
  }, [
    'not ' + verb,
    verb
  ]);

  return this;
};

BaseAssertion.prototype['@matchesFlag'] = function(re) {
  var adverb = this.hasFlag('that') || this.hasFlag('which');
  var verb = adverb ? 'matches' : 'match';
  this.conditionFlag(re, function() {
    return re.test(this.resultValue);
  }, [
    (adverb ? 'does ' : '') + 'not match',
    verb
  ]);

  return this;
};

BaseAssertion.prototype.conditionFlag = function(value, conditionFn, arrverb) {
  this.passed = this.getResult(value, conditionFn);
  var verb = this.negate ? arrverb[0]: arrverb[1];
  this.expected = verb + ' \'' + value + '\'';
  this.actual = this.resultValue;

  if (this.retries > 0) {
    return;
  }

  var needsSpace = this.messageParts.length === 0 ? true : this.messageParts[this.messageParts.length-1].slice(-1) != ' ';
  if (needsSpace) {
    verb = ' ' + verb;
  }
  if (!this.customMessage) {
    this.messageParts.push(
      verb,
      ': "', value, '"'
    );
  }
};

BaseAssertion.prototype.setNegate = function() {
  this.negate = this.flag('negate') || false;
  return this;
};

BaseAssertion.prototype['@beforeFlag'] = function(value) {};

BaseAssertion.prototype['@afterFlag'] = function(value) {};

BaseAssertion.prototype['@haveFlag'] = function(value) {};
BaseAssertion.prototype['@waitForFlag'] = function(value) {
  if (this.waitForMs !== value) {
    this.waitForMs = value;
    if (!this.customMessage) {
      this.messageParts.push(this.checkWaitForMsg(this.waitForMs));
    }
  }
};

BaseAssertion.prototype['@thatFlag'] = function() {
  if (this.retries > 0) {
    return;
  }
  if (!this.customMessage) {
    this.messageParts.push(' that ');
  }
  return this;
};

BaseAssertion.prototype['@whichFlag'] = function() {
  if (this.retries > 0) {
    return;
  }
  if (!this.customMessage) {
    this.messageParts.push(' which ');
  }
  return this;
};

BaseAssertion.prototype['@beFlag'] = function() {};

BaseAssertion.prototype.hasCondition = function() {
  return (this.hasFlag('contains') || this.hasFlag('equal') || this.hasFlag('matches'));
};

BaseAssertion.prototype.checkWaitForMsg = function(waitFor) {
  var preposition = this.flag('before') && 'in' ||
    this.flag('after') && 'after' ||
    'in';
  return ' ' + preposition +' ' + waitFor + 'ms';
};

BaseAssertion.prototype.retryCommand = function() {
  if (this.shouldRetryLocateElement()) {
    this.promise = this.element.createPromise();
    this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
    this.element.locate();
  } else {
    this.onPromiseResolved();
  }
};

module.exports = BaseAssertion;