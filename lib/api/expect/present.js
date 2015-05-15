var util = require('util');
var events = require('events');
var flag = require('chai-nightwatch/lib/chai/utils/flag.js');
var BaseAssertion = require('./_baseAssertion.js');

function PresentAssertion() {
  flag(this.assertion, 'present', true);

  BaseAssertion.call(this);

  this.message = 'Expected element <%s> to ' + (this.negate ? 'not be present' : 'be present');
  this.start();
}

util.inherits(PresentAssertion, BaseAssertion);

PresentAssertion.prototype.executeCommand = function(callback) {
  return callback(this.elementResult);
};

PresentAssertion.prototype.elementFound = function() {
  this.passed = !this.negate;

  if (!this.passed && this.shouldRetry()) {
    return;
  }

  if (this.waitForMs) {
    this.messageParts.push(' - element was present in ' + this.getElapsedTime() + ' ms.');
  }
  if (this.negate) {
    this.actual = 'present';
    this.expected = 'not present';
  }
};

PresentAssertion.prototype.elementNotFound = function() {
  this.passed = this.negate;

  if (!this.passed && this.shouldRetry()) {
    return;
  }

  if (this.waitForMs && this.negate) {
    this.messageParts.push(this.checkWaitForMsg(this.elapsedTime) + '.');
  }
};

PresentAssertion.prototype.retryCommand = function() {
  this.element.deferred.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
  this.element.locate();
};

module.exports = PresentAssertion;

