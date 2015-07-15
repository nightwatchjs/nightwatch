/**
 * Property that checks if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.be.selected;
 *   browser.expect.element('#main').to.not.be.selected;
 *   browser.expect.element('#main').to.be.selected.before(100);
 * };
 * ```
 *
 * @method selected
 * @display .selected
 * @since v0.7
 * @api expect
 */
var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function SelectedAssertion() {
  BaseAssertion.call(this);

  this.message = 'Expected element <%s> to ' + (this.negate ? 'not be selected' : 'be selected');
  this.start();
}

util.inherits(SelectedAssertion, BaseAssertion);

SelectedAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdSelected(this.elementResult.ELEMENT, callback);
};

SelectedAssertion.prototype.elementFound = function() {
  if (this.retries > 0 && this.negate) {
    return;
  }

  this.passed = this.negate ? !this.resultValue : this.resultValue;
  this.expected = this.negate ? 'not selected' : 'selected';
  this.actual = this.resultValue ? 'selected' : 'not selected';

  if (this.passed && this.waitForMs) {
    this.elapsedTime = this.getElapsedTime();
    this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
  }
};

SelectedAssertion.prototype.elementNotFound = function() {
  this.passed = false;
  this.expected = this.negate ? 'not selected' : 'selected';
  this.actual = 'not found';
};

module.exports = SelectedAssertion;
