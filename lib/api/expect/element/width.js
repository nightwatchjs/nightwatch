/**
 * Property that retrieves the width contained by an element. Can be chained to check if contains/equals/matches the specified width or regex.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').width.to.equal('The Night Watch');
 *   browser.expect.element('#main').width.to.not.equal('The Night Watch');
 *   browser.expect.element('#main').width.to.equal('The Night Watch').before(100);
 *   browser.expect.element('#main').width.to.contain('The Night Watch');
 *   browser.expect.element('#main').width.to.match(/The\ Night\ Watch/);
 * };
 *
 *
 * @method width
 * @since v0.7
 * @display .width
 * @api expect
 */
const BaseAssertion = require('../_baseAssertion.js');

class WidthAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('widthFlag', true);
    this.message = 'Expected element <%s> width to' + (this.negate ? ' not' : '');
    this.start();
  }

  onPromiseResolved(elementId) {
    if (elementId) {
      this.elementId = elementId;
    }

    this.setFlags();
    this.executeCommand().then(result => {
      if (!result) {
        return;
      }

      this.resultValue = result.value.width;
      this.resultStatus = result.status;
      this.resultErrorStatus = result.errorStatus;

      this.processFlags();
      this.elementFound();

      if (!this.passed && this.shouldRetry()) {
        this.scheduleRetry();
      } else {
        this.done();
      }
    });
  }

  executeCommand() {
    return this.executeProtocolAction('getElementSize');
  }

  elementFound() {
    const result = this.resultValue;

    // this.passed = this.negate ? result === false : result;
    // this.expected = this.negate ? 'not active' : 'active';
    // this.actual = result ? 'active' : 'not active';

    if (this.passed && this.waitForMs) {
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = false;
  }

}


module.exports = WidthAssertion;
