var util = require('util');
var WaitForElementPresent = require('./waitForElementPresent.js');

/**
 * Waits a given time in milliseconds for an element to be focused in the page before performing any other commands or assertions.
 *
 * If the element fails to be active in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 *
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.waitForElementFocused('input', 1000);
 *   // continue if failed
 *   browser.waitForElementFocused('input', 1000, false);
 *   // with callback
 *   browser.waitForElementFocused('input', 1000, function() {
 *     // do something while we're here
 *   });
 *   // custom Spanish message
 *   browser.waitForElementFocused('input', 1000, 'elemento %s no era activo en %d ms');
 *   // many combinations possible - the message is always the last argument
 *   browser.waitForElementFocused('input', 1000, false, function() {}, 'elemento %s no era activo en %d ms');
 * };
 * ```
 *
 * @method waitForElementFocused
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @api commands
 */
function WaitForElementFocused() {
  WaitForElementPresent.call(this);
  this.expectedValue = 'focused';
}

util.inherits(WaitForElementFocused, WaitForElementPresent);

WaitForElementFocused.prototype.elementFound = function (result, now) {
  return this.isFocused();
};

WaitForElementFocused.prototype.elementFocused = function (result, now) {
  var defaultMsg = 'Element <%s> was focused after %d milliseconds.';
  return this.pass(result, defaultMsg, now - this.startTimer);
};

WaitForElementFocused.prototype.elementNotFocused = function (result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't focused, schedule another check
    this.reschedule('isFocused');
    return this;
  }

  var defaultMsg = 'Timed out while waiting for element <%s> to be focused for %d milliseconds.';
  return this.fail(result, 'not focused', this.expectedValue, defaultMsg);
};

module.exports = WaitForElementFocused;
