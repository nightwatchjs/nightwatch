/**
 * Checks if a given attribute of an element exists and optionally if it has the expected value.
 *
 * @example
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
 *
 *
 * @method attribute
 * @param {string} attribute The attribute name
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @display .attribute(name)
 * @since v0.7
 * @api expect.element
 */
const BaseAssertion = require('./_element-assertion.js');

class AttributeAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.METHOD;
  }

  init(attribute, msg) {
    super.init();

    this.flag('attributeFlag', true);
    this.attribute = attribute;
    this.hasCustomMessage = typeof msg != 'undefined';
    this.message = msg || 'Expected element %s to ' + (this.negate ? 'not have' : 'have') + ' attribute "' + attribute + '"';

    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('getElementAttribute', [this.attribute]);
  }


  onExecuteCommandResult(result) {
    this.resultValue = this.getResultValue(result);
    this.resultStatus = this.getResultStatus(result);
    this.resultErrorStatus = this.getResultError(result);

    if (this.resultValue === null && !this.resultErrorStatus) {
      this.attributeNotFound();

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

  attributeNotFound() {
    this.processFlags();
    this.passed = this.hasCondition() ? false : this.negate;

    if (!this.passed && this.shouldRetry()) {
      this.scheduleRetry();
    } else {
      this.addExpectedInMessagePart();
      if (!this.hasCondition()) {
        this.expected = this.negate ? 'not found' : 'found';
        this.actual = this.getActual('not found');
      }

      if (!this.negate) {
        const attrNotFound = ' - attribute was not found';

        if (this.hasCustomMessage) {
          this.message += attrNotFound;
        } else {
          this.messageParts.push(attrNotFound);
        }
      }

      this.done();
    }
  }

  onResultFailed() {
    this.passed = false;
  }
}



module.exports = AttributeAssertion;
