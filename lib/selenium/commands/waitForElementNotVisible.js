var util = require('util');
var WaitForElementPresent = require('./waitForElementPresent.js');

/**
 * Waits a given time in milliseconds for an element to be not visible (i.e. hidden but existing)
 * in the page before performing any other commands or assertions. If the element fails to
 * be hidden in the specified amount of time, the test fails.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.waitForElementNotVisible('#dialog', 1000);
 *    };
 * ```
 *
 * @method WaitForElementNotVisible
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */
function WaitForElementNotVisible() {
  WaitForElementPresent.call(this);
  this.expectedValue = 'not visible';
}

util.inherits(WaitForElementNotVisible, WaitForElementPresent);

WaitForElementNotVisible.prototype.elementFound = function() {
  return this.isVisible();
};

WaitForElementNotVisible.prototype.elementVisible = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't visible, schedule another check
    this.reschedule('isVisible');
    return this;
  }

  var msg = 'Timed out while waiting for element <' + this.selector +
    '> to not be visible for ' + this.ms + ' milliseconds.';
  return this.fail(result, 'visible', this.expectedValue, msg);
};

WaitForElementNotVisible.prototype.elementNotVisible = function(result, now) {
  var msg = 'Element <' + this.selector + '> was not visible after ' +
    (now - this.startTimer) + ' milliseconds.';

  return this.pass(result, msg);
};

module.exports = WaitForElementNotVisible;
