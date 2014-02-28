var util = require('util');
var WaitForElement = require('./_waitForElement.js');

/**
 * Waits a given time in milliseconds for an element to be not present (i.e. removed) in the page before performing
 * any other commands or assertions. If the element is still present after the specified amount of time, the test fails.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.waitForElementNotPresent('#dialog', 1000);
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
function WaitForElementNotPresent() {
  WaitForElement.call(this);
  this.expectedValue = 'not found';
}

util.inherits(WaitForElementNotPresent, WaitForElement);

WaitForElementNotPresent.prototype.elementFound = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element is still there, schedule another check
    this.reschedule();
    return this;
  }

  var msg = 'Timed out while waiting for element <' + this.selector +
    '> to be removed for ' + this.ms + ' milliseconds.';
  return this.fail(result, 'found', this.expectedValue, msg);
};

WaitForElementNotPresent.prototype.elementNotFound = function(result, now) {
  var msg = 'Element <' + this.selector + '> was not present after ' +
    (now - this.startTimer) + ' milliseconds.';

  return this.pass(result, msg);
};

module.exports = WaitForElementNotPresent;
