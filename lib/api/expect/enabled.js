var util = require('util');
var events = require('events');
var flag = require('chai-nightwatch/lib/chai/utils/flag.js');
var BaseAssertion = require('./_baseAssertion.js');

function EnabledAssertion() {
  BaseAssertion.call(this);

  this.message = 'Expected element <%s> to ' + (this.negate ? 'not be enabled' : 'be enabled');
  this.start();
}

util.inherits(EnabledAssertion, BaseAssertion);

EnabledAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdEnabled(this.elementResult.ELEMENT, callback);
};

EnabledAssertion.prototype.elementFound = function() {
  if (this.retries > 0) {
    return;
  }

  this.passed = this.negate ? !this.resultValue : this.resultValue;
  this.expected = this.negate ? 'not enabled' : 'enabled';
  this.actual = this.resultValue ? 'enabled' : 'not enabled';

  if (this.passed && this.waitForMs) {
    this.messageParts.push(' - condition was met in ' + this.getElapsedTime() + 'ms');
  }
};

EnabledAssertion.prototype.elementNotFound = function() {
  this.passed = false;
  this.expected = this.negate ? 'not enabled' : 'enabled';
  this.actual = 'not found';
  this.messageParts.push(' - element was not found');
};

EnabledAssertion.prototype.retryCommand = function() {
  this.onPromiseResolved();
};

module.exports = EnabledAssertion;
