/**
 * Property that retrieves the text contained by an element. Can be chained to check if contains/equals/matches the specified text or regex.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').text.to.equal('The Night Watch');
 *   browser.expect.element('#main').text.to.not.equal('The Night Watch');
 *   browser.expect.element('#main').text.to.equal('The Night Watch').before(100);
 *   browser.expect.element('#main').text.to.contain('The Night Watch');
 *   browser.expect.element('#main').text.to.match(/The\ Night\ Watch/);
 * };
 *
 *
 * @method text
 * @since v0.7
 * @display .text
 * @api expect.element
 */
const BaseAssertion = require('./_element-assertion.js');

class TextAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('textFlag', true);
    this.message = 'Expected element <%s> text to' + (this.negate ? ' not' : '');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('getElementText');
  }

  onResultSuccess() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    this.addExpectedInMessagePart();
  }

  onResultFailed() {
    this.passed = false;
  }

}


module.exports = TextAssertion;
