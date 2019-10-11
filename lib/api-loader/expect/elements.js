const chai = require('chai-nightwatch');
const flag = chai.flag;
const ExpectLoader = require('./_expect-loader.js');
const Logger = require('../../util/logger.js');
const Element = require('../../element/element.js');

class ExpectElementsLoader extends ExpectLoader {
  static get commandName() {
    return 'elements';
  }

  createElement(selector, using = this.nightwatchInstance.locateStrategy) {
    this.element = Element.createFromSelector(selector, using);
    this.createEmmitter();

    flag(this.instance, 'selector', selector);
    flag(this.instance, 'element', this.element);

    return this;
  }

  async locateMultipleElements() {
    const {element, elementLocator} = this;

    try {
      let result = await elementLocator.findElementsUsingRecursion({
        element,
        returnSingleElement: false
      });

      if (result && result.value) {
        result = this.transport.mapWebElementIds(result);

        this.resultValue = result.value;

        return this.resolve(result.value);
      }

      throw result;
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(err);
      }
      this.reject(err);
    }

    return this.instance;
  }

  createWrapper() {}

  static define(nightwatchInstance, parent = null) {
    ExpectLoader.defineExpect(nightwatchInstance, parent, {
      commandName: ExpectElementsLoader.commandName,

      createInstance() {
        return new ExpectElementsLoader(nightwatchInstance);
      },

      commandFn(args) {
        this.createElement(...args);
        this.locateMultipleElements();
      }
    });
  }
}

module.exports = ExpectElementsLoader;
