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

  constructor(opts) {
    super(opts);

    this.createElement(...this.commandArgs);
  }

  command(...args) {
    return this.locateElements();
  }

  locateElements() {
    const {element} = this;

    return this.elementLocator.findElement({element, returnSingleElement: false})
      .then(result => {
        if (result && result.value) {
          result = this.transport.mapWebElementIds(result);

          this.resultValue = result.value;

          return this.resolve(result.value);
        }

        throw result;
      })
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
