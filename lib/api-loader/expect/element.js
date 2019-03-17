const chai = require('chai-nightwatch');
const flag = chai.flag;
const ExpectLoader = require('./_expect-loader.js');
const Logger = require('../../util/logger.js');
const Element = require('../../element/element.js');

class ExpectElementLoader extends ExpectLoader {
  static get commandName() {
    return 'element';
  }

  createElement(selector, using = this.nightwatchInstance.locateStrategy) {
    this.element = Element.createFromSelector(selector, using);
    this.createEmmitter();

    flag(this.instance, 'selector', selector);
    flag(this.instance, 'element', this.element);

    return this;
  }

  locateElement() {
    const {element} = this;

    this.elementLocator.findElement({element})
      .then(elementResult => {
        if (elementResult && elementResult.value) {
          this.elementId = elementResult.value;
          this.resolve(elementResult.value);

          return;
        }

        this.reject(elementResult);
      })
      .catch(result => {
        if (result instanceof Error) {
          Logger.error(result);
        }
        this.reject(result);
      });

    return this.instance;
  }

  createWrapper() {}

  static define(nightwatchInstance, parent = null) {
    ExpectLoader.defineExpect(nightwatchInstance, parent, {
      commandName: ExpectElementLoader.commandName,

      createInstance() {
        return new ExpectElementLoader(nightwatchInstance);
      },

      commandFn(args) {
        this.createElement(...args);
        this.locateElement();
      }
    });
  }
}

module.exports = ExpectElementLoader;
