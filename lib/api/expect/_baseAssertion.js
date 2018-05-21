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
const NightwatchAssertion = require('../../core/assertion.js');
const flag = require('chai-nightwatch').flag;
const Utils = require('../../util/utils.js');

class BaseAssertion {
  static get AssertionType () {
    return {
      PROPERTY: 'property',
      METHOD: 'method'
    };
  }

  static get ASSERT_FLAGS() {
    return [
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
  }

  /**
   * @override
   * @return {Promise}
   */
  executeCommand() {}

  /**
   * @override
   */
  elementFound() {}

  /**
   * @override
   */
  elementNotFound() {}

  setAssertion(assertion) {
    this.assertion = assertion;

    return this;
  }

  flag(key, value) {
    if (typeof value == 'undefined') {
      return flag(this.assertion, key);
    }

    flag(this.assertion, key, value);

    return this;
  }

  setClient(client) {
    this.client = client;

    return this;
  }

  setFlags() {
    this.element  = this.flag('element');
    this.selector = this.flag('selector');
    this.emitter  = this.flag('emitter');
  }

  init() {
    this.promise  = this.flag('promise');

    this.setNegate();

    this.waitForMs = this.client.api.globals.waitForConditionTimeout || null;
    if (this.waitForMs) {
      this.flag('waitFor', this.waitForMs);
    }

    this.retryInterval  = this.client.api.globals.waitForConditionPollInterval || 500;
    this.retries        = 0;
    this.messageParts   = [];
    this.abortOnFailure = typeof this.client.api.globals.abortOnAssertionFailure == 'undefined' || this.client.api.globals.abortOnAssertionFailure;
    this.passed         = false;
    this.expected       = null;
    this.elementId      = null;
    this.flags          = [];
  }

  start() {
    this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
  }

  onPromiseResolved(elementId) {
    if (elementId) {
      this.elementId = elementId;
    }

    this.setFlags();
    this.executeCommand().then(result => {
      if (!result) {
        return;
      }

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
    });
  }

  onPromiseRejected(response) {
    this.processFlags();
    this.setFlags();

    if (this.shouldRetry() && !this.negate) {
      this.scheduleRetry();
      return;
    }

    this.messageParts.push(' - element was not found');
    this.actual = 'not present';
    this.expected = 'present';

    this.elementNotFound();
    this.done();
  }

  /**
   *
   * @param {String} protocolAction
   * @param {Array} [args]
   * @return {Promise}
   */
  executeProtocolAction(protocolAction, args) {
    return this.emitter.executeProtocolAction(protocolAction, this.elementId, args);
  }

  processFlags() {
    BaseAssertion.ASSERT_FLAGS.forEach(entry => {
      let value = this.flag(entry);
      if (typeof value != 'undefined' && typeof this[`@${entry}Flag`] == 'function') {
        this.flags.push([entry, value]);
        this[`@${entry}Flag`](value);
      }
    });
  }

  hasFlag(type) {
    return this.flags.some(function(flag) {
      return flag[0] === type;
    });
  }

  done() {
    this.formatMessage();
    let stackTrace = this.emitter.stackTrace;

    NightwatchAssertion.create(this.passed, {
      actual: this.actual,
      expected: this.expected
    }, null, this.message, this.abortOnFailure, stackTrace).run(this.client.reporter, this.emitter);
  }

  getResult(value, fn) {
    let result = fn.call(this);
    this.setNegate();

    return this.negate ? !result : result;
  }

  shouldRetryLocateElement() {
    return (!this.elementId || this.stateElementReference(this.resultStatus) || this.stateElementReference(this.resultErrorStatus));
  }

  stateElementReference(statusCode) {
    return this.client.transport.staleElementReference({
      errorStatus: statusCode
    });
  }

  shouldRetry() {
    if (!this.waitForMs) {
      return false;
    }

    this.elapsedTime = this.getElapsedTime();

    return (this.elapsedTime < this.waitForMs);
  }

  getElapsedTime() {
    let timeNow = new Date().getTime();

    return timeNow - this.emitter.startTime;
  }

  scheduleRetry() {
    this.retries++;
    setTimeout(this.retryCommand.bind(this), this.retryInterval);
  }

  formatMessage() {
    let selectorStr = String(this.selector);
    if (selectorStr === '[object Object]') {
      selectorStr = JSON.stringify(this.selector);
    }

    this.message = Utils.format(this.message, selectorStr);
    this.message += this.messageParts.join('');
  }

  '@containsFlag'(value) {
    let verb = (this.hasFlag('that') || this.hasFlag('which')) ? 'contains' : 'contain';
    this.conditionFlag(value, function() {
      return this.resultValue ? this.resultValue.indexOf(value) > -1 : false;
    }, [
      'not ' + verb,
      verb
    ]);

    return this;
  }

  '@equalFlag'(value) {
    let verb;
    if (this.hasFlag('have')) {
      verb = (this.hasFlag('that') || this.hasFlag('which')) ? 'equals' : 'equal to';
    } else {
      verb = 'equal';
    }

    this.conditionFlag(value, function() {
      return this.resultValue === value;
    }, [
      'not ' + verb,
      verb
    ]);

    return this;
  }

  '@matchesFlag'(re) {
    let adverb = this.hasFlag('that') || this.hasFlag('which');
    let verb = adverb ? 'matches' : 'match';

    this.conditionFlag(re, function() {
      return re.test(this.resultValue);
    }, [
      (adverb ? 'does ' : '') + 'not match',
      verb
    ]);

    return this;
  }

  conditionFlag(value, conditionFn, arrverb) {
    this.passed = this.getResult(value, conditionFn);

    let verb = this.negate ? arrverb[0]: arrverb[1];
    this.expected = `${verb} '${value}'`;
    this.actual = this.resultValue;

    if (this.retries > 0) {
      return;
    }

    let needsSpace = this.messageParts.length === 0 ? true : this.messageParts[this.messageParts.length-1].slice(-1) !== ' ';
    if (needsSpace) {
      verb = ' ' + verb;
    }

    if (!this.customMessage) {
      this.messageParts.push(
        `${verb}: "${value}"`
      );
    }
  }

  setNegate() {
    this.negate = this.flag('negate') || false;

    return this;
  }

  '@beforeFlag'(value) {}

  '@afterFlag'(value) {}

  '@haveFlag'(value) {}

  '@waitForFlag'(value) {
    if (this.waitForMs !== value) {
      this.waitForMs = value;
      if (!this.customMessage) {
        this.messageParts.push(this.checkWaitForMsg(this.waitForMs));
      }
    }
  }

  '@thatFlag'() {
    if (this.retries > 0) {
      return;
    }

    if (!this.customMessage) {
      this.messageParts.push(' that ');
    }

    return this;
  }

  '@whichFlag'() {
    if (this.retries > 0) {
      return;
    }

    if (!this.customMessage) {
      this.messageParts.push(' which ');
    }

    return this;
  }

  '@beFlag'() {}

  hasCondition() {
    return (this.hasFlag('contains') || this.hasFlag('equal') || this.hasFlag('matches'));
  }

  checkWaitForMsg(waitFor) {
    let preposition = this.flag('before') && 'in' || this.flag('after') && 'after' || 'in';

    return ' ' + preposition +' ' + waitFor + 'ms';
  }

  retryCommand() {
    if (this.shouldRetryLocateElement()) {
      this.promise = this.emitter.createPromise();
      this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
      this.emitter.locateElement();
    } else {
      this.onPromiseResolved();
    }
  }
}

module.exports = BaseAssertion;