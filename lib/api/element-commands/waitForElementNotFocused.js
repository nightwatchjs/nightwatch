var util = require('util');
var WaitForElementPresent = require('./waitForElementPresent.js');

/**
 * Opposite of `waitForElementFocused`. Waits a given time in milliseconds for an element to be not focused (i.e. focus has shifted to another element) in the page before performing any other commands or assertions.
 *
 * If the element fails to be not active in the specified amount of time, the test fails.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 *
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.waitForElementNotFocused('#textField', 1000);
 * };
 * ```
 *
 * @method waitForElementNotFocused
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @since v0.8.5
 * @see waitForElementFocused
 * @api commands
 */
function WaitForElementNotFocused() {
  WaitForElementPresent.call(this);
  this.expectedValue = 'not focused';
}

util.inherits(WaitForElementNotFocused, WaitForElementPresent);

WaitForElementNotFocused.prototype.elementFound = function() {
  return this.isFocused();
};

WaitForElementNotFocused.prototype.elementFocused = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't focused, schedule another check
    this.reschedule('isFocused');
    return this;
  }

  var defaultMsg = 'Timed out while waiting for element <%s> to not be focused for %d milliseconds.';
  return this.fail(result, 'focused', this.expectedValue, defaultMsg);
};

WaitForElementNotFocused.prototype.elementNotFocused = function(result, now) {
  var defaultMsg = 'Element <%s> was not focused after %d milliseconds.';
  return this.pass(result, defaultMsg, now - this.startTimer);
};

module.exports = WaitForElementNotFocused;
