const {By} = require('selenium-webdriver');
const Element = require('../../element');
const BaseExpect = require('./_baseExpect.js');

class ExpectElement extends BaseExpect {
  get needsFlags() {
    return [
      'value',
      'active',
      'attribute',
      'css',
      'enabled',
      'present',
      'selected',
      'text',
      'type',
      'visible'
    ];
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
    return './element';
  }

  /**
   * @param [args]
   * @return {Promise}
   */
  command(...args) {
    this.createElement(...args);

    return this.locateElement();
  }

  getComponentProperty(property) {
    return this.client.transportActions.executeScript(function(property) {
      // eslint-disable-next-line
      if (!window['@@component_element']) {
        throw new Error('Component was not rendered.');
      }
      // eslint-disable-next-line
      return window['@@component_element'].componentVM[property];
    }, [property]);
  }

  retryCommand() {
    const promise = this.locateElement();
    this.handleCommandPromise(promise);
  }

  createElement(selector, using = this.client.locateStrategy) {
    let value = selector;
    if (selector.webElementLocator instanceof By) {
      const {webElementLocator} = selector;
      value = webElementLocator.value;
      using = webElementLocator.using;
    }

    this.element = Element.createFromSelector(value, using);
    this.flag('element', this.element);

    return this;
  }

  locateElement() {
    const {element} = this;

    return this.elementLocator
      .findElement({element, cacheElementId: false})
      .then(elementResult => {
        if (elementResult && elementResult.value) {
          this.elementId = this.transport.getElementId(elementResult.value);

          return elementResult;
        }

        const {error} = elementResult;
        if (error instanceof Error) {
          throw error;
        }

        throw elementResult;
      });
  }
}

module.exports = ExpectElement;
