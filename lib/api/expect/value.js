/**
 * Property that retrieves the value (i.e. the value attributed) of an element. Can be chained to check if contains/equals/matches the specified text or regex.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('#q').to.have.value.that.equals('search');
 *   browser.expect.element('#q').to.have.value.not.equals('search');
 *   browser.expect.element('#q').to.have.value.which.contains('search');
 *   browser.expect.element('#q').to.have.value.which.matches(/search/);
 * };
 * ```
 *
 * @display .value
 * @method value
 * @api expect
 */
var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function ValueAssertion() {
  this.flag('valueFlag', true);

  BaseAssertion.call(this);

  this.message = 'Expected element <%s> to have value' + (this.negate ? ' not' : '');
  this.start();
}

util.inherits(ValueAssertion, BaseAssertion);

ValueAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdValue(this.elementResult.ELEMENT, callback);
};

ValueAssertion.prototype.elementFound = function() {
  if (this.retries > 0 && this.negate) {
    return;
  }

  if (this.passed && this.waitForMs) {
    var message = '';
    if (this.hasCondition()) {
      message = 'condition was met';
    }
    this.elapsedTime = this.getElapsedTime();
    this.messageParts.push(' - ' + message + ' in ' + this.elapsedTime + 'ms');
  }
};

ValueAssertion.prototype.elementNotFound = function() {
  this.passed = false;
};

module.exports = ValueAssertion;
