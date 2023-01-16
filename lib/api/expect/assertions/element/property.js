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
 *   browser.expect.element('body').to.have.domProperty('classList').contain('class-two');
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
  static get aliases() {
    return ['domProperty'];
  }

  static get assertionType() {
    return BaseAssertion.AssertionType.METHOD;
  }

  init(property, msg) {
    super.init();

    this.flag('attributeFlag', true);
    this.property = property;
    this.hasCustomMessage = typeof msg != 'undefined';
    this.message = msg || `Expected element %s to ${this.negate ? 'not have' : 'have'} dom property "${this.property}"`;

    this.start();
  }

  executeCommand() {
    if (this.isComponent()) {
      if (!this.hasCustomMessage) {
        this.message = `Expected component %s to ${this.negate ? 'not have' : 'have'} property "${this.property}"`;
      }
      //return this.emitter.getComponentProperty(this.property);
    }

    return this.executeProtocolAction('getElementProperty', [this.property]);
  }

  hasProperty() {
    if (this.flag('component') === true) {
      return this.resultValue !== undefined;
    }

    return this.resultValue !== null;
  }

  onExecuteCommandResult(result) {
    this.resultValue = this.getResultValue(result);
    this.resultStatus = this.getResultStatus(result);
    this.resultErrorStatus = this.getResultError(result);

    if (!this.hasProperty() && !this.resultErrorStatus) {
      this.propertyNotFound();

      return;
    }

    this.processFlags();
    this.onResultSuccess();

    if (!this.passed && this.shouldRetry()) {
      this.scheduleRetry();
    } else {
      this.done();
    }
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
        this.actual = this.getActual('not found');
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
