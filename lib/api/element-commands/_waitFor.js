const Utils = require('../../util/utils.js');
const NightwatchAssertion = require('../../core/assertion.js');
const ElementCommand = require('../../element/command.js');

/*!
 * Base class for waitForElement commands. It provides a command
 * method and element* methods to be overridden by subclasses
 *
 * @constructor
 */
class WaitForElement extends ElementCommand {
  get retryOnSuccess() {
    return false;
  }

  static isElementVisible(result) {
    return result.value === true;
  }

  validateArgsCount() {}

  setupActions() {
    const validate = (result) => this.isResultSuccess(result);
    const successHandler = (result) => this.elementFound(result);

    this.executor
      .queueAction({
        action: () => this.findElement(),
        retryOnSuccess: this.retryOnSuccess,
        retryOnFailure: !this.retryOnSuccess,
        validate,
        successHandler,
        errorHandler: (err) => {
          if (err.name !== 'TimeoutError') {
            throw err;
          }

          if (err.response && err.response.value) {
            return this.elementFound(err.response);
          }

          return this.elementNotFound(err.response);
        }
      });
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
   * - with no arguments; in this case a global default timeout is used
   *  waitForElement('body');
   *
   * - with a global default timeout and a callback
   *  waitForElement('body', function() {});
   *
   * - with a global default timeout, a callback, and a custom message
   *  waitForElement('body', function() {}, 'test message');
   *
   * - with a global default timeout a custom message
   *  waitForElement('body', 'test message');
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
   * - with a timeout, a custom abortOnFailure, and a custom message
   *  waitForElement('body', 500, true, 'test message');
   *
   * - with a timeout, a custom abortOnFailure, and a callback
   *  waitForElement('body', 500, true, function() { .. });
   *
   * - with a timeout, a custom abortOnFailure, a callback and a custom message
   *  waitForElement('body', 500, true, function() { .. }, 'test message');
   *
   * - with a timeout, a custom reschedule interval, and a callback
   *  waitForElement('body', 500, 100, function() { .. });
   *
   * - with a timeout, a custom rescheduleInterval, and a custom abortOnFailure
   *  waitForElement('body', 500, 100, false);
   *
   *
   * @param {string} selector
   * @param {number|function|string} milliseconds
   * @param {function|boolean|string|number} callbackOrAbort
   * @returns {WaitForElement}
   */
  setArguments() {
    super.setArguments();

    let rescheduleInterval;
    ////////////////////////////////////////////////////////////////////////////
    // custom timeout value
    //
    // waitForElement('body', 100);
    ////////////////////////////////////////////////////////////////////////////
    if (Utils.isNumber(this.args[0])) {
      this.setMilliseconds(this.args[0]);
    }

    ////////////////////////////////////////////////
    // DEPRECATED
    // backwards compatibility
    ////////////////////////////////////////////////
    if (Utils.isBoolean(this.args[1])) {
      ////////////////////////////////////////////////
      // The command was called with a custom abortOnFailure:
      //
      // waitForElement('body', 500, false);
      ////////////////////////////////////////////////
      this.abortOnFailure = this.args[1];
    }
    ////////////////////////////////////////////////
    // The command was called with a custom timeout and rescheduleInterval:
    //
    // waitForElement('body', 500, 100);
    ////////////////////////////////////////////////
    else if (Utils.isNumber(this.args[1])) {
      rescheduleInterval = this.args[1];

      ////////////////////////////////////////////////
      // The command was called with a custom timeout, rescheduleInterval, and custom abortOnFailure:
      //
      // waitForElement('body', 500, 100, false);
      // waitForElement('body', 500, 100, false, function() {});
      ////////////////////////////////////////////////
      if (Utils.isBoolean(this.args[2])) {
        this.abortOnFailure = this.args[2];
      }
    }

    if (rescheduleInterval) {
      this.setRescheduleInterval(rescheduleInterval);
    }
  }

  pass(result, defaultMsg, timeMs) {
    this.message = this.formatMessage(defaultMsg, timeMs);

    return this.assert(result, true, {}, null, this.message, this.abortOnFailure);
  }

  fail(result, actual, expected, defaultMsg) {
    this.message = this.formatMessage(defaultMsg);

    return this.assert(result, false, {actual, expected}, null, this.message, this.abortOnFailure, this.stackTrace);
  }

  assert(response, ...args) {
    return NightwatchAssertion.create(...args)
      .run(this.client.reporter)
      .then(err => {
        if (err instanceof Error) {
          err.abortOnFailure = this.abortOnFailure;

          return this.complete(err, response.result);
        }

        // FIXME
        // Due to backwards compatibility reasons, we keep here the simplified result object
        return this.complete(null, response.result);
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
