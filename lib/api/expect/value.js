/**
 * Checks the value of a specified element.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.expect.element('#q').to.have.value.equal.to('search');
 *      browser.expect.element('#q').to.have.value.not.equal.to('search');
 *      browser.expect.element('#q').to.have.value.which.contains('search');
 *      browser.expect.element('#q').to.have.value.which.matches(/search/);
 *    };
 * ```
 *
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

ValueAssertion.prototype.retryCommand = function() {
  this.onPromiseResolved();
};

module.exports = ValueAssertion;