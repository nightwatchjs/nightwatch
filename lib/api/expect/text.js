var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function TextAssertion() {
  this.flag('textFlag', true);

  BaseAssertion.call(this);

  this.message = 'Expected element <%s> text to' + (this.negate ? ' not' : '');
  this.start();
}

util.inherits(TextAssertion, BaseAssertion);

TextAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdText(this.elementResult.ELEMENT, callback);
};


TextAssertion.prototype.elementFound = function() {
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

TextAssertion.prototype.elementNotFound = function() {
  this.passed = false;
  this.messageParts.push(' - element was not found');
};

TextAssertion.prototype.retryCommand = function() {
  this.onPromiseResolved();
};

module.exports = TextAssertion;