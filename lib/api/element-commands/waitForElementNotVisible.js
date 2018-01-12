const WaitForElementPresent = require('./waitForElementPresent.js');

/**
 * Opposite of `waitForElementVisible`. Waits a given time in milliseconds for an element to be not visible (i.e. hidden but existing) in the page before performing any other commands or assertions.
 *
 * If the element fails to be hidden in the specified amount of time, the test fails.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 *
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.waitForElementNotVisible('#dialog', 1000);
 * };
 * ```
 *
 * @method waitForElementNotVisible
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @since v0.4.0
 * @see waitForElementVisible
 * @api commands
 */
class WaitForElementNotVisible extends WaitForElementPresent {
  constructor() {
    super();

    this.expectedValue = 'not visible';
  }

  elementFound() {
    return this.checkElementVisible();
  }

  elementVisible(result, now) {
    if (now - this.startTimer < this.ms) {
      // element wasn't visible, schedule another check
      this.reschedule('checkElementVisible');

      return this;
    }

    let defaultMsg = 'Timed out while waiting for element <%s> to not be visible for %d milliseconds.';

    return this.fail(result, 'visible', this.expectedValue, defaultMsg);
  }

  elementNotVisible(result, now) {
    let defaultMsg = 'Element <%s> was not visible after %d milliseconds.';

    return this.pass(result, defaultMsg, now - this.startTimer);
  }

}

module.exports = WaitForElementNotVisible;
