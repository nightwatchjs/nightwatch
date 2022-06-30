/**
 * Property that checks if an element is present in the DOM.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.be.present;
 *   browser.expect.element('#main').to.not.be.present;
 *   browser.expect.element('#main').to.be.present.before(100);
 * };
 *
 *
 * @method present
 * @display .present
 * @since v0.7
 * @api expect.element
 */
const BaseAssertion = require('./_element-assertion.js');

class PresentAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  isElementNotFoundError() {
    return this.resultErrorStatus.name === 'NoSuchElementError';
  }

  init() {
    super.init();

    this.flag('present', true);
    this.message = 'Expected element %s to ' + (this.negate ? 'not be present' : 'be present');
    this.start();
  }

  executeCommand() {
    return Promise.resolve(this.elementId);
  }

  onResultSuccess() {
    this.passed = !this.negate;

    if (!this.passed && this.shouldRetry()) {
      return;
    }

    this.addExpectedInMessagePart();

    if (this.negate) {
      this.actual = 'present';
      this.expected = 'not present';
    }
  }

  onResultFailed() {
    if ((this.resultErrorStatus instanceof Error) && !this.isElementNotFoundError()) {
      this.passed = false;
      this.actual = 'error while locating the element';
      this.expected = this.negate ? 'not present' : 'present';

      return;
    }

    this.expected = this.negate ? 'not present' : 'present';
    this.passed = this.negate;
  }

  retryCommand() {
    this.elementId = null;
    super.retryCommand();
  }
}

module.exports = PresentAssertion;
