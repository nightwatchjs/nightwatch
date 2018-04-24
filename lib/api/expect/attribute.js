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
const BaseAssertion = require('./_baseAssertion.js');

class AttributeAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.METHOD;
  }

  init(attribute, msg) {
    super.init();

    this.flag('attributeFlag', true);
    this.attribute = attribute;
    this.customMessage = msg;
    this.message = msg || 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' attribute "' + attribute + '"';

    this.start();
  }

  executeCommand() {
    return this.emitter.executeProtocolAction('getElementAttribute', this.elementId, [this.attribute]).then(result => {
      if (!this.emitter.isResultSuccess(result) || result.value === null) {
        throw result;
      }

      return result;
    }).catch(result => {
      this.attributeNotFound();

      return false;
    });
  }

  elementFound() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    if (!this.hasCondition()) {
      this.passed = this.negate ? false : true;
      this.expected = this.negate ? 'not found' : 'found';
      this.actual = 'found';
    }

    if (this.waitForMs && this.passed) {
      let message = 'attribute was present';
      if (this.hasCondition()) {
        message = 'condition was met';
      }
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - ' + message + ' in ' + this.elapsedTime + 'ms');
    }
  }

  attributeNotFound() {
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
  }

  elementNotFound() {
    this.passed = false;
  }
}



module.exports = AttributeAssertion;
