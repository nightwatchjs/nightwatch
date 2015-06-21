/**
 * Checks if the type (i.e. tag name) of a specified element is of an expected value.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('#q').to.be.an('input');
 *   browser.expect.element('#w').to.be.a('span');
 * };
 * ```
 *
 * @method a
 * @display .a(type)
 * @alias an
 * @since v0.7
 * @param {string} type The expected type
 * @api expect
 */
var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function TypeAssertion(type) {
  this.type = type;

  BaseAssertion.call(this);

  this.article = ['a', 'e', 'i', 'o'].indexOf(type.substring(0, 1)) > -1 ? 'an' : 'a';
  this.message = 'Expected element <%s> to ' + (this.negate ? 'not be' : 'be') + ' ' + this.article +' ' + type;
  this.start();
}

util.inherits(TypeAssertion, BaseAssertion);

TypeAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdName(this.elementResult.ELEMENT, callback);
};

TypeAssertion.prototype.elementFound = function() {
  if (this.retries > 0 && this.negate) {
    return;
  }

  this.passed = this.negate ? (this.resultValue != this.type) : (this.resultValue == this.type);
  this.expected = this.negate ? 'not be ' + this.article + ' ' + this.type : 'be ' + this.article + ' ' + this.type;
  this.actual = this.resultValue;

  if (this.passed && this.waitForMs) {
    this.messageParts.push(' - condition was met in ' + this.getElapsedTime() + 'ms');
  }
};

TypeAssertion.prototype.elementNotFound = function() {
  this.passed = false;
};

TypeAssertion.prototype.retryCommand = function() {
  this.onPromiseResolved();
};

module.exports = TypeAssertion;