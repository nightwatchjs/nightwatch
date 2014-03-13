var util = require('util');
var WaitForElement = require('./_waitForElement.js');

/**
 * Waits a given time in milliseconds for an element to be present in the page before performing
 * any other commands or assertions. If the element fails to be present in the specified amount
 * of time, the test fails.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.waitForElementPresent('body', 1000);
 *    };
 * ```
 *
 * @method waitForElementNotPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */
function WaitForElementPresent() {
  WaitForElement.call(this);
  this.expectedValue = 'found';
}

util.inherits(WaitForElementPresent, WaitForElement);

WaitForElementPresent.prototype.elementFound = function(result, now) {
  var defaultMsg = 'Element <%s> was present after %d milliseconds.';
  return this.pass(result, defaultMsg);
};

WaitForElementPresent.prototype.elementNotFound = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't found, schedule another check
    this.reschedule();
    return this;
  }

  var defaultMsg = 'Timed out while waiting for element <%s> to be present for %d milliseconds.';
  return this.fail(false, 'not found', this.expectedValue, defaultMsg);
};

module.exports = WaitForElementPresent;
