/**
 * Checks if a given DOM property of an element has the expected value. For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('body').to.have.propery('className').equals('test-class');
 *   browser.expect.element('body').to.have.propery('className').matches(/^something\ else/);
 *   browser.expect.element('body').to.not.have.propery('classList').equals('test-class');
 *   browser.expect.element('body').to.have.propery('classList').deep.equal(['class-one', 'class-two']);
 *   browser.expect.element('body').to.have.propery('classList').contain('class-two');
 * };
 *
 * @method property
 * @param {string} property The property name
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @display .property(name)
 * @since v0.7
 * @api expect.element
 */
const BaseAssertion = require('../_baseAssertion.js');

class PropertyAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.METHOD;
  }

  init(property, msg) {
    super.init();

    this.flag('attributeFlag', true);
    this.property = property;
    this.customMessage = msg;
    this.message = msg || 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' dom property "' + property + '"';

    this.start();
  }

  executeCommand() {
    return this.emitter.executeProtocolAction('getElementProperty', this.elementId, [this.property]).then(result => {
      if (!this.emitter.isResultSuccess(result) || result.value === null) {
        throw result;
      }

      return result;
    }).catch(result => {
      this.propertyNotFound();

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

  propertyNotFound() {
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
        this.messageParts.push(' - property was not found');
      }
      this.done();
    }
  }

  elementNotFound() {
    this.passed = false;
  }
}



module.exports = PropertyAssertion;
