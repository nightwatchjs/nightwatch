const Element = require('../../element');
const BaseExpect = require('./_baseExpect.js');

class ExpectElements extends BaseExpect {
  get needsFlags() {
    return ['value'];
  }

  get hasAssertions() {
    return true;
  }

  get promiseRejectedMsg() {
    return 'Element was not found.';
  }

  /**
   * If this is missing, it will be the main expect command name
   * @return {string}
   */
  get assertionsPath() {
    return './elements';
  }

  command(...args) {
    this.createElement(...args);

    return this.locateElements();
  }

  locateElements() {
    return this.elementLocator.locateMultipleElements(this.element);
  }

  retryCommand() {
    const promise = this.locateElements();
    this.handleCommandPromise(promise);
  }

  createElement(selector, using = this.client.locateStrategy) {
    this.element = Element.createFromSelector(selector, using);
    this.flag('element', this.element);

    return this;
  }

}

module.exports = ExpectElements;
