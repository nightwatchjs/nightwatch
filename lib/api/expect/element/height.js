/**
 * Property that retrieves the height contained by an element. Can be chained to check if contains/equals/matches the specified height or regex.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').height.to.equal('The Night Watch');
 *   browser.expect.element('#main').height.to.not.equal('The Night Watch');
 *   browser.expect.element('#main').height.to.equal('The Night Watch').before(100);
 *   browser.expect.element('#main').height.to.contain('The Night Watch');
 *   browser.expect.element('#main').height.to.match(/The\ Night\ Watch/);
 * };
 *
 *
 * @method height
 * @since v0.7
 * @display .height
 * @api expect
 */
const BaseAssertion = require('../_baseAssertion.js');

class HeightAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('heightFlag', true);
    this.message = 'Expected element <%s> height to' + (this.negate ? ' not' : '');
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

      this.resultValue = result.value.height;
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


module.exports = HeightAssertion;
