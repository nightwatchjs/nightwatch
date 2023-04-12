const {By, RelativeBy} = require('selenium-webdriver');

const LocateElement = require('./locator.js');
const LocateStrategy = require('./strategy.js');

class AppiumLocator extends LocateElement {
  /**
   * @param {object|string} element
   * @return {By|RelativeBy}
   */
  static create(element) {
    if (!element) {
      throw new Error(`Error while trying to locate element: missing element definition; got: "${element}".`);
    }

    const byInstance = LocateElement.locateInstanceOfBy(element);
    if (byInstance !== null) {
      return byInstance;
    }

    const elementInstance = LocateElement.createElementInstance(element);

    LocateStrategy.validate(elementInstance.locateStrategy);

    return new By(elementInstance.locateStrategy, elementInstance.selector);
  }
}

module.exports = AppiumLocator;
