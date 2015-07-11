/**
 * Checks a given css property of an element exists and optionally if it has the expected value.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.have.css('display');
 *   browser.expect.element('#main').to.have.css('display', 'Testing for display');
 *   browser.expect.element('#main').to.not.have.css('display');
 *   browser.expect.element('#main').to.have.css('display').before(100);
 *   browser.expect.element('#main').to.have.css('display').which.equals('block');
 *   browser.expect.element('#main').to.have.css('display').which.contains('some value');
 *   browser.expect.element('#main').to.have.css('display').which.matches(/some\ value/);
 * };
 * ```
 *
 * @method css
 * @param {string} property The css property name
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.*
 * @display .css(property)
 * @since v0.7
 * @api expect
 */
var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function CssAssertion(property, msg) {
  this.cssProperty = property;
  this.flag('cssFlag', true);

  BaseAssertion.call(this);
  this.customMessage = typeof msg != 'undefined';
  this.message = msg || 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' css property "' + property + '"';
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
  if (this.retries > 0 && this.negate) {
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
};

module.exports = CssAssertion;
