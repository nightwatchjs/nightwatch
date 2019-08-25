/**
 * Checks a given property of an element exists and optionally if it has the expected value.
 *
 * @example
 * this.demoTest = function (browser) {
    *   browser.expect.element('#main').to.have.property('href');
    *   browser.expect.element('#main').to.have.property('href', 'Testing for href');
    *   browser.expect.element('#main').to.not.have.property('href');
    *   browser.expect.element('#main').to.have.property('href').before(100);
    *   browser.expect.element('#main').to.have.property('href').which.equals('https://nightwatchjs.org/');
    *   browser.expect.element('#main').to.have.property('href').which.contains('nightwatchjs');
    *   browser.expect.element('#main').to.have.property('href').which.matches(/nightwatchjs/);
    * };
    *
    *
    * @method property
    * @param {string} property The property name
    * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.*
    * @display .property(property)
    * @since v1.2.2
    * @api expect.element
    */
const BaseAssertion = require('../_baseAssertion.js');
   
class PropertyAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.METHOD;
  }

  init(property, msg) {
    super.init();

    this.property = property;
    this.flag('propertyFlag', true);
    this.customMessage = msg;
    this.message = msg || 'Expected element <%s> to ' + (this.negate ? 'not have' : 'have') + ' property "' + property + '"';
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
      let message = 'property was present';
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
