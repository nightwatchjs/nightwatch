/**
 * Checks a given css property of an element exists and optionally if it has the expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.have.css('display');
 *   browser.expect.element('#main').to.have.css('display', 'Testing for display');
 *   browser.expect.element('#main').to.not.have.css('display');
 *   browser.expect.element('#main').to.have.css('display').before(100);
 *   browser.expect.element('#main').to.have.css('display').which.equals('block');
 *   browser.expect.element('#main').to.have.css('display').which.contains('some value');
 *   browser.expect.element('#main').to.have.css('display').which.matches(/some\ value/);
 * };
 *
 *
 * @method css
 * @param {string} property The css property name
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.*
 * @display .css(property)
 * @since v0.7
 * @api expect.element
 */
const BaseAssertion = require('../_baseAssertion.js');

class CssAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.METHOD;
  }

  init(property, msg) {
    super.init();

    this.cssProperty = property;
    this.flag('cssFlag', true);
    this.customMessage = typeof msg != 'undefined';
    this.message = msg || 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' css property "' + property + '"';
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('getElementCSSValue', [this.cssProperty]);
  }

  '@haveFlag'() {
    this.passed = this.negate ? (this.resultValue === '') : (this.resultValue !== '');
    this.expected = this.negate ? 'not present' : 'present';
    this.actual = this.resultValue === '' ? 'not present' : 'present';
  }

  elementFound() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    if (this.passed && this.waitForMs) {
      let message = 'property was present';

      if (this.hasCondition()) {
        message = 'condition was met';
      }
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - ' + message + ' in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = false;
  }
}

module.exports = CssAssertion;
