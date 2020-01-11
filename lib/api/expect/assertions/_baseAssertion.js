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
const assert = require('assert');
const {flag} = require('chai-nightwatch');
const Utils = require('../../../utils');
const {AssertionRunner, getExpectedMessage} = require('../../../assertion');
const {Logger} = Utils;

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
      'and',
      'have',
      'which',
      'equal',
      'contains',
      'startsWith',
      'endsWith',
      'matches',
      'before',
      'after',
      'waitFor'
    ];
  }

  get transport() {
    return this.client.transport;
  }

  get transportActions() {
    return this.emitter.transportActions;
  }

  get assertion() {
    return this.runner.assertion;
  }

  get selector() {
    return this.flag('element') && this.flag('element').selector;
  }

  /**
   * @override
   * @return {Promise}
   */
  executeCommand() {}

  /**
   * @override
   */
  onResultSuccess() {}

  /**
   * @override
   */
  onResultFailed() {}

  flag(key, value) {
    if (typeof value == 'undefined') {
      return flag(this.chaiExpect, key);
    }

    flag(this.chaiExpect, key, value);

    return this;
  }

  getFlags() {
    return flag(this.chaiExpect);
  }

  setFlags() {
    this.emitter  = this.flag('emitter');
    this.setDeepEqualFlag();

    this.element  = this.flag('element');
    if (this.element) {
      const {timeout, retryInterval, abortOnFailure, message} = this.element;
      if (Utils.isNumber(timeout)) {
        this.waitForMs = timeout;
        this.flag('waitFor', this.waitForMs);
      }

      if (Utils.isNumber(retryInterval)) {
        this.retryInterval = retryInterval;
      }

      if (Utils.isBoolean(abortOnFailure)) {
        this.abortOnFailure = abortOnFailure;
      }

      if (message) {
        this.message = message;
        this.hasCustomMessage = true;
      }
    }
  }

  /**
   * @param {Nightwatch} nightwatchInstance
   * @param {chai.Assertion} chaiExpect
   * @param {string} expectCommandName
   */
  constructor({nightwatchInstance, chaiExpect, expectCommandName}) {
    this.client = nightwatchInstance;
    this.chaiExpect = chaiExpect;
    this.expectCommandName = expectCommandName;
  }

  init() {
    const {waitForConditionTimeout, waitForConditionPollInterval, abortOnAssertionFailure} = this.client.api.globals;

    this.promise  = this.flag('promise');
    this.setFlags();
    this.setNegate();
    this.setDeepEqualFlag();
    this.setWaitForFlag(waitForConditionTimeout);

    this.retryInterval  = waitForConditionPollInterval || 500;
    this.abortOnFailure = abortOnAssertionFailure;

    this.hasCustomMessage = false;
    this.message = '';
    this.retries = 0;
    this.messageParts = [];
    this.passed = false;
    this.expected = null;
    this.resultValue = null;
    this.flags = [];
  }

  start() {
    this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
  }

  onPromiseResolved() {
    this.setFlags();

    this.executeCommand().then(result => {
      if (!result) {
        return;
      }

      this.resultValue = result.value;
      this.resultStatus = result.status;
      this.resultErrorStatus = result.errorStatus;

      this.processFlags();
      this.onResultSuccess();

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

    this.addExpectedInMessagePart();

    let notFoundStr = ' - element was not found';
    if (response instanceof Error && response.name === 'NotFoundError') {
      notFoundStr = ` - ${response.message}`;
    }
    if (this.hasCustomMessage) {
      this.message += notFoundStr;
    } else {
      this.messageParts.push(notFoundStr);
    }

    this.actual = 'not present';
    if (!this.expected) {
      this.expected = 'present';
    }

    this.onResultFailed();
    this.done();
  }

  processFlags() {
    this.getFlags().forEach((value, key) => {
      if (BaseAssertion.ASSERT_FLAGS.includes(key) && Utils.isFunction(this[`@${key}Flag`])) {
        this.flags.push(key);
        this[`@${key}Flag`](value);
      }
    });
  }

  hasFlag(type) {
    return this.flags.some(function(flagName) {
      return flagName === type;
    });
  }

  done() {
    this.formatMessage();
    this.runAssertion();
  }

  runAssertion() {
    const stackTrace = this.emitter.stackTrace;
    const reporter = this.client.reporter;
    const {passed, actual, expected, message, abortOnFailure} = this;

    this.runner = new AssertionRunner({
      passed,
      addExpected: false,
      err: {
        expected, actual
      }, message, abortOnFailure, stackTrace, reporter
    });

    this.runner.run()
      .catch(err => (err))
      .then(result => {
        const isError = result instanceof Error;

        if (isError) {
          this.emitter.emit('error', result, this.abortOnFailure);
        } else {
          this.emitter.emit('complete');
        }
      });
  }

  getResult(value, fn) {
    let result = fn.call(this);
    this.setNegate();

    return this.negate ? !result : result;
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
    if (!this.passed) {
      this.addExpectedMessage();
    }

    this.addTimeMessagePart();

    if (!this.hasCustomMessage) {
      this.message += this.messageParts.join('');
    }
  }

  '@containsFlag'(value) {
    const verb = (this.hasFlag('that') || this.hasFlag('which')) ? 'contains' : 'contain';

    this.conditionFlag(value, function() {
      if (!Utils.isString(this.resultValue) && !Array.isArray(this.resultValue)) {
        Logger.warn(`Unexpected non-string or array result value returned for contains: ${this.resultValue}`);

        return false;
      }

      return this.resultValue.indexOf(value) > -1;
    }, [`not ${verb}`, verb]);

    return this;
  }

  '@startsWithFlag'(value) {
    const verb = (this.hasFlag('that') || this.hasFlag('which')) ? 'starts with' : 'start with';

    this.conditionFlag(value, function() {
      if (!Utils.isString(this.resultValue)) {
        Logger.warn(`Unexpected non-string result value returned for startsWith: ${this.resultValue}`);

        return false;
      }

      return this.resultValue.indexOf(value) === 0;
    }, [
      `not ${verb}`,
      verb
    ]);

    return this;
  }

  '@endsWithFlag'(value) {
    const verb = (this.hasFlag('that') || this.hasFlag('which')) ? 'ends with' : 'end with';

    this.conditionFlag(value, function() {
      if (!Utils.isString(this.resultValue)) {
        Logger.warn(`Unexpected non-string result value returned for endsWith: ${this.resultValue}`);

        return false;
      }

      return (this.resultValue.lastIndexOf(value) + value.length) === this.resultValue.length;
    }, [
      `not ${verb}`,
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

    if (this.deepEqual) {
      verb = `deep ${verb}`;
    }

    this.conditionFlag(value, function() {
      if (this.deepEqual || Utils.isObject(value)) {
        try {
          assert.deepStrictEqual(value, this.resultValue);

          return true;
        } catch (err) {
          return false;
        }
      }

      return this.resultValue === value;
    }, [
      `not ${verb}`,
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

    if (!this.hasCustomMessage) {
      this.messageParts.push(`${verb}: ${Logger.colors.brown('"' + value + '"')}`);
    }
  }

  setNegate() {
    this.negate = this.flag('negate') || false;

    return this;
  }

  setDeepEqualFlag() {
    this.deepEqual = this.flag('deep') || false;

    return this;
  }

  setWaitForFlag(waitForConditionTimeout) {
    this.waitForMs = waitForConditionTimeout || null;
    if (this.waitForMs) {
      this.flag('waitFor', this.waitForMs);
    }

    return this;
  }

  '@beforeFlag'(value) {}

  '@afterFlag'(value) {}

  '@haveFlag'(value) {}

  '@waitForFlag'(value) {
    if (this.waitForMs !== value) {
      this.waitForMs = value;
    }
  }

  '@andFlag'() {
    if (this.retries > 0) {
      return;
    }

    if (!this.hasCustomMessage) {
      this.messageParts.push(' and ');
    }

    return this;
  }

  '@thatFlag'() {
    if (this.retries > 0) {
      return;
    }

    if (!this.hasCustomMessage) {
      this.messageParts.push(' that ');
    }

    return this;
  }

  '@whichFlag'() {
    if (this.retries > 0) {
      return;
    }

    if (!this.hasCustomMessage) {
      this.messageParts.push(' which ');
    }

    return this;
  }

  '@beFlag'() {}

  addTimeMessagePart() {
    this.elapsedTime = this.getElapsedTime();
    const timeStr = Logger.colors.stack_trace(' (' + this.elapsedTime + 'ms)');

    if (this.hasCustomMessage) {
      this.message += timeStr
    } else {
      this.messageParts.push(timeStr);
    }
  }

  addExpectedMessage() {
    const {actual, expected} = this;
    const message = getExpectedMessage({
      actual, expected
    });

    if (this.hasCustomMessage) {
      this.message += message;
    } else {
      this.messageParts.push(message);
    }
  }

  addExpectedInMessagePart() {
    const expectedIn = ` in ${this.waitForMs}ms`;

    if (!this.hasCustomMessage && (this.flag('before') || this.flag('after')) && !this.messageParts.includes(expectedIn)) {
      this.messageParts.push(expectedIn);
    }
  }

  hasCondition() {
    return (
      this.hasFlag('contains') ||
      this.hasFlag('equal') ||
      this.hasFlag('matches') ||
      this.hasFlag('startsWith') ||
      this.hasFlag('endsWith')
    );
  }

  retryCommand() {
    this.promise = this.emitter.createRetryPromise();
    this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
    this.emitter.retryCommand();
  }
}

module.exports = BaseAssertion;
