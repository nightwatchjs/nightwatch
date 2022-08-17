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

    if (this.commandArgs[0] instanceof Promise) {
      return;
    }

    this.createElement(...this.commandArgs);
  }

  async command(...args) {
    if (!this.element && (this.commandArgs[0] instanceof Promise)) {
      const value = await this.commandArgs[0];
      this.element = {
        value,
        selector: 'elements'
      };

      this.flag('element', this.element);
      this.resultValue = value;
      this.retryUnavailable = true; //retry is not possible in this case

      return this.resolve(value);
    }

    return this.locateElements();
  }

  locateElements() {
    const {element} = this;

    return this.elementLocator
      .findElement({element, returnSingleElement: false, cacheElementId: false})
      .then(result => {
        const {value, error} = result;

        let elements;
        if (value) {
          elements = this.transport.mapWebElementIds(value);
        } else if (error instanceof Error && error.name === 'NoSuchElementError') {
          elements = this.transport.mapWebElementIds([]);
        } else {
          throw result;
        }

        this.resultValue = elements;

        return this.resolve(elements);
      });
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
