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
  if (this.retries > 0) {
    return;
  }

  this.passed = this.negate ? !this.resultValue : this.resultValue;
  this.expected = this.negate ? 'not selected' : 'selected';
  this.actual = this.resultValue ? 'selected' : 'not selected';

  if (this.passed && this.waitForMs) {
    this.messageParts.push(' - condition was met in ' + this.getElapsedTime() + 'ms');
  }
};

SelectedAssertion.prototype.elementNotFound = function() {
  this.passed = false;
  this.expected = this.negate ? 'not selected' : 'selected';
  this.actual = 'not found';
  this.messageParts.push(' - element was not found');
};

SelectedAssertion.prototype.retryCommand = function() {
  this.onPromiseResolved();
};

module.exports = SelectedAssertion;