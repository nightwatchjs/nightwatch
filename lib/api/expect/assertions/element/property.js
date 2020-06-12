/**
 * Checks if a given DOM property of an element has the expected value. For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('body').to.have.property('className').equals('test-class');
 *   browser.expect.element('body').to.have.property('className').matches(/^something\ else/);
 *   browser.expect.element('body').to.not.have.property('classList').equals('test-class');
 *   browser.expect.element('body').to.have.property('classList').deep.equal(['class-one', 'class-two']);
 *   browser.expect.element('body').to.have.property('classList').contain('class-two');
 * };
 *
 * @method property
 * @param {string} property The property name
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @display .property(name)
 * @api expect.element
 */
const BaseAssertion = require('./_element-assertion.js');

class PropertyAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.METHOD;
  }

  init(property, msg) {
    super.init();

    this.flag('attributeFlag', true);
    this.property = property;
    this.hasCustomMessage = typeof msg != 'undefined';
    this.message = msg || 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' dom property "' + property + '"';

    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('getElementProperty', [this.property]).then(result => {
      if (!this.transport.isResultSuccess(result) || result.value === null) {
        throw result;
      }

      return result;
    }).catch(result => {
      this.propertyNotFound();

      return false;
    });
  }

  onResultSuccess() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    if (!this.hasCondition()) {
      this.passed = !this.negate;
      this.expected = this.negate ? 'not found' : 'found';
      this.actual = 'found';
    }

    this.addExpectedInMessagePart();
  }

  propertyNotFound() {
    this.processFlags();
    this.passed = this.hasCondition() ? false : this.negate;

    if (!this.passed && this.shouldRetry()) {
      this.scheduleRetry();
    } else {
      this.addExpectedInMessagePart();
      if (!this.hasCondition()) {
        console.log('EXPECTED', this.expected)
        //this.expected = this.negate ? 'not found' : 'found';
        this.actual = 'not found';
      }

      if (!this.negate) {
        this.messageParts.push(' - property was not found');
      }
      this.done();
    }
  }

  onResultFailed() {
    this.passed = false;
  }
}

module.exports = PropertyAssertion;
