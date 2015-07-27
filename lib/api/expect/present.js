/**
 * Property that checks if an element is present in the DOM.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.be.present;
 *   browser.expect.element('#main').to.not.be.present;
 *   browser.expect.element('#main').to.be.present.before(100);
 * };
 * ```
 *
 * @method present
 * @display .present
 * @since v0.7
 * @api expect
 */
var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function PresentAssertion() {
  this.flag('present', true);

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
    this.elapsedTime = this.getElapsedTime();
    this.messageParts.push(' - element was present in ' + this.elapsedTime + 'ms');
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
  this.promise = this.element.createPromise();
  this.element.deferred.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
  this.element.locate();
};

module.exports = PresentAssertion;
