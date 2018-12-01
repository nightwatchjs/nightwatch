const WaitForElement = require('./_waitForElement.js');

/**
 * Waits a given time in milliseconds for an element to be present in the page before performing any other commands or assertions.
 *
 * If the element fails to be present in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 *
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.waitForElementPresent('body', 1000);
 *   // continue if failed
 *   browser.waitForElementPresent('body', 1000, false);
 *   // with callback
 *   browser.waitForElementPresent('body', 1000, function() {
 *     // do something while we're here
 *   });
 *   // custom Spanish message
 *   browser.waitForElementPresent('body', 1000, 'elemento %s no era presente en %d ms');
 *   // many combinations possible - the message is always the last argument
 *   browser.waitForElementPresent('body', 1000, false, function() {}, 'elemento %s no era presente en %d ms');
 * };
 *
 * @method waitForElementPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {number} [time=waitForConditionTimeout] The total number of milliseconds to wait before failing.
 * @param {number} [poll=waitForConditionPollInterval] The number of milliseconds to wait between checks. You can use this only if you also specify the time parameter.
 * @param {boolean} [abortOnFailure=abortOnAssertionFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @api protocol.elements
 */
class WaitForElementPresent extends WaitForElement {
  constructor() {
    super();

    this.expectedValue = 'found';
  }

  elementFound(result, now) {
    let defaultMsg = 'Element <%s> was present after %d milliseconds.';

    return this.pass(result, defaultMsg, now - this.startTimer);
  }

  elementNotFound(result, now) {
    if (now - this.startTimer < this.ms) {
      // element wasn't found, schedule another check
      this.reschedule();

      return this;
    }

    let defaultMsg = 'Timed out while waiting for element <%s> to be present for %d milliseconds.';

    return this.fail({value:false}, 'not found', this.expectedValue, defaultMsg);
  }
}

module.exports = WaitForElementPresent;
