var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function CssAssertion(property) {
  this.cssProperty = property;
  this.flag('cssFlag', true);

  BaseAssertion.call(this);

  this.message = 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' css property "' + property + '"';
  this.start();
}

util.inherits(CssAssertion, BaseAssertion);

CssAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdCssProperty(this.elementResult.ELEMENT, this.cssProperty, callback);
};

CssAssertion.prototype['@haveFlag'] = function() {
  this.passed = this.negate ? (this.resultValue === '') : (this.resultValue !== '');
  this.expected = this.negate ? 'not present' : 'present';
  this.actual = this.resultValue === '' ? 'not present' : 'present';
};

CssAssertion.prototype.elementFound = function() {
  if (this.retries > 0) {
    return;
  }

  if (this.passed && this.waitForMs) {
    var message = 'property was present';
    if (this.hasCondition()) {
      message = 'condition was met';
    }
    this.elapsedTime = this.getElapsedTime();
    this.messageParts.push(' - ' + message + ' in ' + this.elapsedTime + 'ms');
  }
};

CssAssertion.prototype.elementNotFound = function() {
  this.passed = false;
  this.messageParts.push(' - element was not found');
};

CssAssertion.prototype.retryCommand = function() {
  this.onPromiseResolved();
};

module.exports = CssAssertion;
