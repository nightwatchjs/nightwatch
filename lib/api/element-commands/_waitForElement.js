const EventEmitter = require('events');
const Logger = require('../../util/logger.js');
const Utils = require('../../util/utils.js');
const NightwatchAssertion = require('../../core/assertion.js');
const Element = require('../../page-object/element.js');

/*!
 * Base class for waitForElement commands. It provides a command
 * method and element* methods to be overridden by subclasses
 *
 * @constructor
 */
class WaitForElement extends EventEmitter {
  constructor() {
    super();

    this.startTimer = null;
    this.cb = null;
    this.ms = null;
    this.abortOnFailure = typeof this.api.globals.abortOnAssertionFailure == 'undefined' || this.api.globals.abortOnAssertionFailure;

    this.rescheduleInterval = this.api.globals.waitForConditionPollInterval || this.client.options.waitForConditionPollInterval || 500; //ms
    this.throwOnMultipleElementsReturned = this.api.globals.throwOnMultipleElementsReturned || this.client.options.throwOnMultipleElementsReturned || false;

    this.element = null;
    this.elementId = null;
  }

  get transport() {
    return this.client.transport;
  }

  /*!
   * The public command function which will be called by the test runner. Arguments can be passed in a variety of ways.
   *
   * The custom message always is last and the callback is always before the message or last if a message is not passed.
   *
   * The second argument is always the time in milliseconds. The third argument can be either of:
   * - abortOnFailure: this can overwrite the default behaviour of aborting the test if the condition is not met within the specified time
   * - rescheduleInterval: this can overwrite the default polling interval (currently 500ms)
   * The above can be supplied also together, in which case the rescheduleInterval is specified before the abortOnFailure.
   *
   * Some of the multiple usage possibilities:
   * ---------------------------------------------------------------------------
   * - with no arguments; in this case a global default timeout is expected
   *  waitForElement('body');
   *
   * - with a global default timeout and a callback
   *  waitForElement('body', function() {});
   *
   * - with a global default timeout, a callback and a custom message
   *  waitForElement('body', function() {}, 'test message');
   *
   * - with only the timeout
   *  waitForElement('body', 500);
   *
   * - with a timeout and a custom message
   *  waitForElement('body', 500, 'test message);
   *
   * - with a timeout and a callback
   *  waitForElement('body', 500, function() { .. });
   *
   * - with a timeout and a custom abortOnFailure
   *  waitForElement('body', 500, true);
   *
   * - with a timeout, a custom abortOnFailure and a custom message
   *  waitForElement('body', 500, true, 'test message');
   *
   * - with a timeout, a custom abortOnFailure and a callback
   *  waitForElement('body', 500, true, function() { .. });
   *
   * - with a timeout, a custom abortOnFailure, a callback and a custom message
   *  waitForElement('body', 500, true, function() { .. }, 'test message');
   *
   * - with a timeout, a custom reschedule interval and a callback
   *  waitForElement('body', 500, 100, function() { .. });
   *
   * - with a timeout, a custom rescheduleInterval and a custom abortOnFailure
   *  waitForElement('body', 500, 100, false);
   *
   *
   * @param {string} selector
   * @param {number|function|string} milliseconds
   * @param {function|boolean|string|number} callbackOrAbort
   * @returns {WaitForElement}
   */
  command(selector, milliseconds, callbackOrAbort) {
    this.createElement(selector);
    this.startTimer = new Date().getTime();
    this.ms = this.setMilliseconds(milliseconds);

    //this._stackTrace = commandFn.stackTrace;

    if (typeof arguments[1] === 'function') {
      ////////////////////////////////////////////////
      // The command was called with an implied global timeout:
      //
      // waitForElement('body', function() {});
      // waitForElement('body', function() {}, 'custom message');
      ////////////////////////////////////////////////
      this.cb = arguments[1];
    } else if (typeof arguments[2] === 'boolean') {
      ////////////////////////////////////////////////
      // The command was called with a custom abortOnFailure:
      //
      // waitForElement('body', 500, false);
      ////////////////////////////////////////////////
      this.abortOnFailure = arguments[2];

      // The optional callback is the 4th argument now
      this.cb = arguments[3] || function() {};
    } else if (typeof arguments[2] === 'number') {
      ////////////////////////////////////////////////
      // The command was called with a custom rescheduleInterval:
      //
      // waitForElement('body', 500, 100);
      ////////////////////////////////////////////////
      this.rescheduleInterval = arguments[2];

      if (typeof arguments[3] === 'boolean') {
        ////////////////////////////////////////////////
        // The command was called with a custom rescheduleInterval and custom abortOnFailure:
        //
        // waitForElement('body', 500, 100, false);
        ////////////////////////////////////////////////
        this.abortOnFailure = arguments[3];

        // The optional callback is the 5th argument now
        this.cb = arguments[4] || function() {};
      } else {
        // The optional callback is the 4th argument now
        this.cb = arguments[3] || function() {};
      }
    } else {
      // The optional callback is the 3th argument now
      this.cb = (typeof callbackOrAbort === 'function' && callbackOrAbort) || function() {};
    }

    // support for a custom message
    this.message = null;
    if (arguments.length > 1) {
      let lastArgument = arguments[arguments.length - 1];
      if (typeof lastArgument === 'string') {
        this.message = lastArgument;
      }
    }

    this.selector = selector;
    this.locateElement();

    return this;
  }

  createElement(selector) {
    this.element = Element.createFromSelector(selector, this.client.locateStrategy);

    return this;
  }

  /*!
   * Reschedule the checkElement
   */
  reschedule(method = 'checkElement') {
    setTimeout(() => {
      this[method]();
    }, this.rescheduleInterval);
  }

  /*!
   * @override
   */
  elementFound(result, now) {}

  /*!
   * @override
   */
  elementNotFound(result, now) {}

  /*!
   * @override
   */
  elementVisible(result, now) {}

  /*!
   * @override
   */
  elementNotVisible(result, now) {}

  complete(...args) {
    args.push(this);
    this.cb.apply(this.api, args);

    this.emit('complete');

    return this;
  }

  pass(result, defaultMsg, timeMs) {
    // FIXME: use correct assertion
    this.message = this.formatMessage(defaultMsg, timeMs);

    NightwatchAssertion.runAssertion(this.passed, {}, null, this.message, this.abortOnFailure);

    return this.complete(result);
  }

  fail(result, actual, expected, defaultMsg) {
    // FIXME: use correct assertion
    this.message = this.formatMessage(defaultMsg);

    NightwatchAssertion.runAssertion(this.passed, {actual, expected}, null, this.message, this.abortOnFailure, this._stackTrace);

    return this.complete(result);
  }

  /*!
 * Will start checking if the element exists and if not re-schedule the check
 * until the timeout expires or the condition has been met
 */
  locateElement() {
    this.getProtocolCommand().then(elementIds => {
      let now = new Date().getTime();

      if (elementIds.length > 0) {
        if (elementIds.length > 1) {
          let message = `WaitForElement found ${elementIds.length} elements for selector: "${this.element.selector}".`;
          if (this.throwOnMultipleElementsReturned) {
            throw new Error(message);
          }
          if (this.client.options.output) {
            console.warn(Logger.colors.green(`  Warn: ${message} Only the first one will be used.`));
          }
        }

        this.elementId = elementIds[0];

        return this.elementFound(elementIds, now);
      }

      return this.elementNotFound(elementIds, now);
    });
  }

  getProtocolCommand() {
    return this.transport.locateMultipleElements(this.element)
      .catch(result => {
        return [];
      });

  }

  /*!
   * Will start checking if the element is visible and if not re-schedule the check
   * until the timeout expires or the condition has been met
   */
  isVisible() {
    this.transport.executeProtocolAction('isElementDisplayed', [this.elementId])
      .then(result => {
        let now = new Date().getTime();
        if (this.transport.isResultSuccess(result)) {
          // element was visible
          return this.elementVisible(result, now);
        }

        if (this.transport.staleElementReference(result)) {
          return this.locateElement();
        }

        return this.elementNotVisible(result, now);
      });
  }

  /**
   * @param {string} defaultMsg
   * @param {number} [timeMs]
   * @returns {string}
   */
  formatMessage(defaultMsg, timeMs) {
    return Utils.format(this.message || defaultMsg, this.element.selector, timeMs || this.ms);
  }
}

module.exports = WaitForElement;
