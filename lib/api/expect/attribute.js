/**
 * Checks if a given attribute of an element exists and optionally if it has the expected value.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('body').to.have.attribute('data-attr');
 *   browser.expect.element('body').to.not.have.attribute('data-attr');
 *   browser.expect.element('body').to.not.have.attribute('data-attr', 'Testing if body does not have data-attr');
 *   browser.expect.element('body').to.have.attribute('data-attr').before(100);
 *   browser.expect.element('body').to.have.attribute('data-attr')
 *     .equals('some attribute');
 *   browser.expect.element('body').to.have.attribute('data-attr')
 *     .not.equals('other attribute');
 *   browser.expect.element('body').to.have.attribute('data-attr')
 *     .which.contains('something');
 *   browser.expect.element('body').to.have.attribute('data-attr')
 *     .which.matches(/^something\ else/);
 * };
 * ```
 *
 * @method attribute
 * @param {string} attribute The attribute name
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @display .attribute(name)
 * @since v0.7
 * @api expect
 */
var util = require('util');
var events = require('events');
var BaseAssertion = require('./_baseAssertion.js');

function AttributeAssertion(attribute, msg) {
  this.flag('attributeFlag', true);
  this.attribute = attribute;
  this.customMessage = msg;
  this.message = msg || 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' attribute "' + attribute + '"';

  BaseAssertion.call(this);

  this.start();
}

util.inherits(AttributeAssertion, BaseAssertion);

AttributeAssertion.prototype.executeCommand = function(callback) {
  this.protocol.elementIdAttribute(this.elementResult.ELEMENT, this.attribute, function(result) {
    if (result.value !== null && result.status === 0) {
      callback(result);
    } else {
      this.attributeNotFound();
    }
  }.bind(this));
};

AttributeAssertion.prototype.elementFound = function() {
  if (this.retries > 0 && this.negate) {
    return;
  }
  if (!this.hasCondition()) {
    this.passed = this.negate ? false : true;
    this.expected = this.negate ? 'not found' : 'found';
    this.actual = 'found';
  }

  if (this.waitForMs && this.passed) {
    var message = 'attribute was present';
    if (this.hasCondition()) {
      message = 'condition was met';
    }
    this.elapsedTime = this.getElapsedTime();
    this.messageParts.push(' - ' + message + ' in ' + this.elapsedTime + 'ms');
  }
};

AttributeAssertion.prototype.attributeNotFound = function() {
  this.processFlags();
  this.passed = this.hasCondition() ? false : this.negate;

  if (!this.passed && this.shouldRetry()) {
    this.scheduleRetry();
  } else {
    if (!this.hasCondition()) {
      this.expected = this.negate ? 'not found' : 'found';
      this.actual = 'not found';
    }

    if (!this.negate) {
      this.messageParts.push(' - attribute was not found');
    }
    this.done();
  }
};

AttributeAssertion.prototype.elementNotFound = function() {
  this.passed = false;
};

module.exports = AttributeAssertion;
