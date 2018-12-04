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

class YPositionAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('yPositionFlag', true);
    this.message = 'Expected element <%s> yPosition to' + (this.negate ? ' not' : '');
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

      this.resultValue = result.value.y;
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
    return this.executeProtocolAction('isElementLocationInView');
  }

  elementFound() {
    const result = this.resultValue;

    if (this.passed && this.waitForMs) {
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = false;
  }

}


module.exports = YPositionAssertion;
