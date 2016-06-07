/**
 * Property that asserts the visibility of a specified element.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.be.visible;
 *   browser.expect.element('#main').to.not.be.visible;
 *   browser.expect.element('#main').to.be.visible.before(100);
 * };
 * ```
 *
 * @display .visible
 * @method visible
 * @api expect
 */
var util = require('util');
var BaseAssertion = require('./_baseAssertion.js');

function VisibleAssertion() {
  BaseAssertion.call(this);

  this.message = 'Expected element <%s> to ' + (this.negate ? 'not be visible' : 'be visible');
  this.start();
}

util.inherits(VisibleAssertion, BaseAssertion);

VisibleAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdDisplayed(this.elementResult.ELEMENT, callback);
};

VisibleAssertion.prototype.elementFound = function() {
  this.passed = this.negate ? this.resultValue === false : this.resultValue;
  this.expected = this.negate ? 'not visible' : 'visible';
  this.actual = this.resultValue ? 'visible' : 'not visible';

  if (this.passed && this.waitForMs) {
    this.elapsedTime = this.getElapsedTime();
    this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
  }
};

VisibleAssertion.prototype.elementNotFound = function() {
  this.passed = false;
  this.expected = this.negate ? 'not visible' : 'visible';
  this.actual = 'not found';
};

module.exports = VisibleAssertion;
