var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function ValueAssertion() {
  this.flag('valueFlag', true);

  BaseAssertion.call(this);

  this.message = 'Expected element <%s> value to' + (this.negate ? ' not' : '');
  this.start();
}

util.inherits(ValueAssertion, BaseAssertion);

ValueAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdValue(this.elementResult.ELEMENT, callback);
};

ValueAssertion.prototype.elementFound = function() {
  if (this.retries > 0) {
    return;
  }

  if (this.passed && this.waitForMs) {
    var message = '';
    if (this.hasCondition()) {
      message = 'condition was met';
    }
    this.messageParts.push(' - ' + message + ' in ' + this.getElapsedTime() + 'ms');
  }
};

ValueAssertion.prototype.elementNotFound = function() {
  this.passed = false;
  this.messageParts.push(' - element was not found');
};

ValueAssertion.prototype.retryCommand = function() {
  this.onPromiseResolved();
};

module.exports = ValueAssertion;